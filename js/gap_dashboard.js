$(document).ready(function(){
    main();
    loadEvents();

    function main(){
        var serializedAttributes = [{id: "jurisdiction", label: "Jurisdiction", values: [{id: "np", label: "National Public"}, {id: "alaska", label: "Alaska"}]}, {id: "grade", label: "Grade", values: [{id: "grade4", label: "Grade 4"}, {id: "grade8", label: "Grade 8"}, {id: "grade12", label: "Grade 12"}]}, {id: "race", label: "Race", values: [{id: "white", label: "White"}, {id: "black", label: "Black"}, {id: "asian", label: "Asian"}, {id: "hispanic", label: "Hispanic"}]}, {id: "nslp", label: "NSLP Eligibility", values: [{id: "eligibleNslp", label: "Eligible for NSLP"}, {id: "notEligibleNslp", label: "Not eligible for NSLP"}]}]
        var collection = new AttributeCollection(serializedAttributes);
        
        $("#AddRowButton").data("collection", collection);

        // alert(collection.attributes[1].id);
        // alert(collection.attributes[1].label);
        // alert(collection.attributes[1].attributeValues[0].id);
        // alert(collection.attributes[1].attributeValues[0].label);;
        
        $("#jurisdiction").html(collection.getHtmlOptionsIncluding(["jurisdiction"]));
        $("#attribute1").html(collection.getHtmlOptionsExcluding(["jurisdiction", "grade"]));
        $("#attribute2").html(collection.getHtmlOptionsExcluding(["jurisdiction", "grade"]));
    }

    function loadEvents(){
        $("#AddRowButton").click(function(){
            var clone = $(this).data("collection").getClone();
        })
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

    this.addAttribute = function(attribute){
        //this.attributes[] = attribute;
    }

    this.selectAttributeValue = function(attributeValueId){

    }

    this.getHtmlOptionsIncluding = function(includedAttributeValues){
        var html = "<option>Choose</option>";
        for(var i = 0; i < this.attributes.length; i++){
            var attribute = this.attributes[i];
            if(attribute.isInArray(includedAttributeValues)){
                html += "<optgroup label = '" + this.attributes[i].label + "'>";   
                for(var j = 0; j < this.attributes[i].attributeValues.length; j++){
                    var attributeValue = this.attributes[i].attributeValues[j];
                    html += "<option value = '" + attributeValue.id + "'>" + attributeValue.label + "</option>"
                }
            }
        }
        return html;
    }

    this.getHtmlOptionsExcluding = function(unincludedAttributeValues){
        var html = "<option>Choose</option>";
        for(var i = 0; i < this.attributes.length; i++){
            var attribute = this.attributes[i];
            if(!attribute.isInArray(unincludedAttributeValues)){
                html += "<optgroup label = '" + this.attributes[i].label + "'>";   
                for(var j = 0; j < this.attributes[i].attributeValues.length; j++){
                    var attributeValue = this.attributes[i].attributeValues[j];
                    html += "<option value = '" + attributeValue.id + "'>" + attributeValue.label + "</option>"
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
        for(var i = 0; i < array.length; i++){
            if(this.id == array[i]) return true;
        }
        return false;
    }
}