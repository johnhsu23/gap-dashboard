$(document).ready(function(){
    main();
    loadEvents();

    function main(){
        var serializedAttributes = [{id: "jurisdiction", label: "Jurisdiction", values: [{id: "np", label: "National Public"}, {id: "alaska", label: "Alaska"}]}, {id: "grade", label: "Grade", values: [{id: "grade4", label: "Grade 4"}, {id: "grade8", label: "Grade 8"}, {id: "grade12", label: "Grade 12"}]}, {id: "race", label: "Race", values: [{id: "white", label: "White"}, {id: "black", label: "Black"}, {id: "asian", label: "Asian/Pacific Islander"}, {id: "americanIndian", label: "American Indian/Alaska Native"}, {id: "hispanic", label: "Hispanic"}]}, {id: "gender", label: "Gender", values: [{id: "male", label: "Male"}, {id: "female", label: "Female"}]}, {id: "nslp", label: "NSLP Eligibility", values: [{id: "eligibleNslp", label: "Eligible for NSLP"}, {id: "notEligibleNslp", label: "Not eligible for NSLP"}, {id: "nslpNotEnoughInformation", label: "Information not available"}]}, {id: "parEd", label: "Parental Education Level", values: [{id: "parEdNoHS", label: "Did not finish high school"}, {id: "parEdHS", label: "Gradudated from high school"}, {id: "parEdSomeEdAfterHS", label: "Some education after high school"}, {id: "parEdCollege", label: "Graducated from college"}, {id: "parEdUnknown", label: "Unknown"}]}]
        var collection = new AttributeCollection(serializedAttributes);
        
        $("button.add-new").data("collection", collection);

        // alert(collection.attributes[1].id);
        // alert(collection.attributes[1].label);
        // alert(collection.attributes[1].attributeValues[0].id);
        // alert(collection.attributes[1].attributeValues[0].label);;
        
        $("#jurisdiction").html(collection.getHtmlOptionsIncluding(["jurisdiction"]));
        $("#attribute1").html(collection.getHtmlOptionsExcluding(["jurisdiction", "grade"]));
        $("#attribute2").html(collection.getHtmlOptionsExcluding(["jurisdiction", "grade"]));
    }

    function loadEvents(){        
        $(".select-attribute").on("change", function(){
            var otherId = ($(this).attr("id") == "attribute1") ? "attribute2" : "attribute1";
            attributeChanged($(this).attr("id"), otherId);
        })
        function attributeChanged(id, otherId){
            var collection = $("button.add-new").data("collection");
            if($("#" + id).val() != "" && $("#" + otherId).val() == ""){                
                var attributeId = collection.getAttributeByAttributeValue($("#" + id).val());                
                var html = collection.getHtmlOptionsIncluding([attributeId], [$("#" + id).val()]);
            }else if($("#" + id).val() == "" && $("#" + otherId).val() == ""){
                var html = collection.getHtmlOptionsExcluding(["jurisdiction", "grade"]);
            }else if($("#" + id).val() != "" && $("#" + otherId).val() != ""){
                var attributeId = collection.getAttributeByAttributeValue($("#" + id).val());
                var otherAttributeId = collection.getAttributeByAttributeValue($("#" + otherId).val());
                if(attributeId != otherAttributeId){
                    var html = collection.getHtmlOptionsIncluding([attributeId], [$("#" + id).val()]);
                }
            }
            $("#" + otherId).html(html);           
        }

        //Add new row button clicked
        $("button.add-new").click(function(){
            var clone = $(this).data("collection").getClone();
            var $attribute1 = $("#attribute1");
            var $attribute2 = $("#attribute2");
            if($attribute1.val() != "" && $attribute2.val() != ""){
                var html = "<tr>" + $(".template").html() + "</tr>";
                $("#data-rows tr:last()").before(html);
                var collection = $("button.add-new").data("collection");
                var attributeId = collection.getAttributeByAttributeValue($attribute1.val());                
                html = collection.getHtmlOptionsExcluding(["jurisdiction", "grade", attributeId]);
                $("#data-rows tr:nth-last-child(2) .u-full-width").html(html);
                $("#data-rows tr:nth-last-child(2) .cross-tab").on("change", function(){                    
                    $(this).parents("tr").find("td > img").show();
                })
                $("#data-rows tr:nth-last-child(2) .simple-graph").on("click", function(){
                    alert("simple graph clicked");
                    //$(this).parents("tr").find("td > img").show();
                })
                $("#data-rows tr:nth-last-child(2) .click-it").on("click", function(){
                  alert("click");
                  $(".show-it").toggle("slow");
                });
            }
        })

        function crossTabChanged(){

        }
    }
})

function AttributeCollection(serializedAttributes){
    this.attributes = [];

    for(var i = 0; i < serializedAttributes.length; i++){
        var attribute = new Attribute(serializedAttributes[i].id, serializedAttributes[i].label);
        this.attributes[this.attributes.length] = attribute;
        for(var j = 0; j < serializedAttributes[i].values.length; j++){
            var attributeValue = new AttributeValue(serializedAttributes[i].values[j].id, serializedAttributes[i].values[j].label);
            attribute.attributeValues[attribute.attributeValues.length] = attributeValue;
        }
    }

    this.getHtmlOptionsIncluding = function(includedAttributeValues, excludedAttributeValues){
        var html = "<option value=''>Choose</option>";
        for(var i = 0; i < this.attributes.length; i++){
            var attribute = this.attributes[i];
            if(attribute.isInArray(includedAttributeValues)){
                html += "<optgroup label = '" + this.attributes[i].label + "'>";   
                for(var j = 0; j < this.attributes[i].attributeValues.length; j++){
                    var attributeValue = this.attributes[i].attributeValues[j];
                    if(!attributeValue.isInArray(excludedAttributeValues)){
                        html += "<option value = '" + attributeValue.id + "'>" + attributeValue.label + "</option>"
                    }
                }
            }
        }
        return html;
    }

    this.getHtmlOptionsExcluding = function(unincludedAttributeValues){
        var html = "<option value=''>Choose</option>";
        for(var i = 0; i < this.attributes.length; i++){
            var attribute = this.attributes[i];
            if(!attribute.isInArray(unincludedAttributeValues)){
                html += "<optgroup label = '" + this.attributes[i].label + "'>";   
                for(var j = 0; j < this.attributes[i].attributeValues.length; j++){
                    var attributeValue = this.attributes[i].attributeValues[j];
                    if(!attributeValue.isInArray(unincludedAttributeValues)){
                        html += "<option value = '" + attributeValue.id + "'>" + attributeValue.label + "</option>"
                    }
                }
            }
        }
        return html;
    }

    this.getAllHtmlOptions = function(){
        var html = "";
        for(var i = 0; i < serializedAttributes.length; i++){
            html += "<optgroup label = '" + serializedAttributes[i].label + "'>";   
            for(var j = 0; j < serializedAttributes[i].values.length; j++){
                html += "<option value = '" + serializedAttributes[i].values[j].id + "'>" + serializedAttributes[i].values[j].label + "</option>"
                var attributeValue = new AttributeValue(serializedAttributes[i].values[j].id, serializedAttributes[i].values[j].label);
                attribute.attributeValues[attribute.attributeValues.length] = attributeValue;
            }
        }
        return html;
    }

    this.getAttributeByAttributeValue = function(attributeValueId){
        for(var i = 0; i < this.attributes.length; i++){
            var attribute = this.attributes[i];            
            for(var j = 0; j < attribute.attributeValues.length; j++){
                var attributeValue = attribute.attributeValues[j];                
                if(attributeValue.id == attributeValueId){
                    return attribute.id;
                }
            }
        }
        return null;
    }

    this.getAttributeValues = function(attirbuteId){

    }

    this.getClone = function(){
        return jQuery.extend(true, {}, this)
    }
}

function Attribute(id, label){
    this.id = id;
    this.label = label;
    this.selectedValueIndex = -1;
    this.attributeValues = [];

    this.isInArray = function(array){
        if(!array) return;
        for(var i = 0; i < array.length; i++){
            if(this.id == array[i]) return true;
        }
        return false;
    }

    this.isValueSet = function(){
        if(this.selectedValueIndex == -1) return false;
        return true;
    }

    this.setValueById = function(id){
        for(var i = 0; i < attributeValues.length; i++){
            if(attributeValues[i].id == id){
                this.selectedValueIndex = i;
                return true;
            }
        }
        return false;
    }

    this.val = function(){
        if(this.isValueSet()){
            return attributeValues[selectedValueIndex];
        }
        return null;
    }

    this.addPossibleValue = function(attributeValue){
        //this.attributeValues[] = attributeValue;
    }
}

function AttributeValue(id, label){
    this.id = id;
    this.label = label;
    this.selected = false;

    this.isInArray = function(array){
        if(!array) return;
        for(var i = 0; i < array.length; i++){
            if(this.id == array[i]) return true;
        }
        return false;
    }
}