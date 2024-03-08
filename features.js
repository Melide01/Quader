function brightness(color, pow) {
    if (typeof color === 'string') {
        if (color[0] === '#') {
            color = color.slice(1);
            color = parseInt(color, 16);
        } else {
            color = parseInt(color);
        }
    };
    
    let result = Math.floor(color*pow);
    let output = result.toString(16).toUpperCase();
    if (output.length < 2) {
        output = '0' + output;
    };
    return output;
}

function invert(color, pow) {
    if (typeof color === 'string') {
        if (color[0] === '#') {
            color = color.slice(1);
            color = parseInt(color, 16);
        } else {
            color = parseInt(color);
        }
    };

    let normalize = color / 255;
    let invert = normalize - 0.5;
    let result = color - Math.floor(invert*(510*pow));
    let output = result.toString(16).toUpperCase();
    if (output.length < 2) {
        output = '0' + output;
    };
    return output
};

function colorToRgb(color) {
    color = color.slice(1);
    output = [];

    for (let i = 0; i < color.length; i += 2) {
        output.push(parseInt(color.substring(i, i+2), 16));
    };

    return output;
}

function quickColorManip(color, pow, functionName) {
    let newColor = colorToRgb(color);
    let temp = [];
    for (let i = 0; i < newColor.length; i++) {
        temp.push(window[functionName](newColor[i], pow));
    };
    let output = '#' + temp[0] + temp[1] + temp[2];
    return output;
}

function getColorMoyenne(color) {
    const output = (colorToRgb(color)[0] + colorToRgb(color)[1] + colorToRgb(color)[2]) / 3;
    return Math.round(output);
}

function intelligentInverse(color) {
    const dicColor = colorToRgb(color);
    const fac = (255 - getColorMoyenne(color)) / 255;
    console.log(fac)
    return '#' + brightness(dicColor[0], fac) + brightness(dicColor[1], fac) + brightness(dicColor[2], fac);
}



// dictionary features
function addToDictionaryIndex(obj, key, value, index) {
    if (typeof obj !== 'object') {
        alert('This is not a dictionary');
        return obj;
    };
    if (obj[key] !== undefined) {
        alert('Sorry, this key already exists');
        return obj;
    }
    var outputDictionary = {};
    const dicToArray = Object.keys(obj);

    if (index > dicToArray.length) {
        index = dicToArray.length;
    };

    for (let i=0; i<dicToArray.length + 1; i++) {
        if (i === index) {
            outputDictionary[key] = value;
            continue
        } else {
            if (i < index) {
                outputDictionary[dicToArray[i]] = obj[dicToArray[i]];
            } else {
                outputDictionary[dicToArray[i-1]] = obj[dicToArray[i-1]];
            }
        }
    }
    return outputDictionary;
}

function moveKeyToIndex(obj, key, index) {
    
    if (typeof obj !== 'object') {
        alert('This is not a dictionary');
        return obj;
    };
    const saveValue = obj[key];
    delete obj[key];
    return addToDictionaryIndex(obj, key, saveValue, index);
}