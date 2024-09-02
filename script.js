document.getElementById('processButton').addEventListener('click', function() {
    const inputFile = document.getElementById('inputFile').files[0];
    const outputFileName = document.getElementById('outputFile').value;
    const key = document.getElementById('key').value;
    const operation = document.querySelector('input[name="operation"]:checked').value;

    if (!inputFile || !outputFileName || !operation) {
        alert('Please fill in all the fields.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        let result;
        const text = e.target.result;

        switch (operation) {
            case 'xorEncrypt':
                result = xorEncrypt(text, key);
                break;
            case 'xorDecrypt':
                result = xorDecrypt(text, key);
                break;
            case 'caesarEncrypt':
                result = caesarEncrypt(text, parseInt(key));
                break;
            case 'caesarDecrypt':
                result = caesarEncrypt(text, 26 - parseInt(key)); // Decrypt using inverse shift
                break;
            case 'vigenereEncrypt':
                result = vigenereEncrypt(text, key);
                break;
            case 'vigenereDecrypt':
                result = vigenereDecrypt(text, key);
                break;
            default:
                alert('Invalid operation selected.');
                return;
        }

        downloadResult(result, outputFileName);
    };

    reader.readAsText(inputFile);
});

function xorEncrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

function xorDecrypt(text, key) {
    return xorEncrypt(text, key); // XOR encryption and decryption are symmetric
}

function caesarEncrypt(text, shift) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            let code = char.charCodeAt(0);
            let base = code < 97 ? 65 : 97;
            return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char;
    }).join('');
}

function vigenereEncrypt(text, key) {
    let result = '';
    let keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char.match(/[a-z]/i)) {
            let base = char.charCodeAt(0) < 97 ? 65 : 97;
            let shift = key[keyIndex % key.length].toUpperCase().charCodeAt(0) - 65;
            result += String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
}

function vigenereDecrypt(text, key) {
    let result = '';
    let keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char.match(/[a-z]/i)) {
            let base = char.charCodeAt(0) < 97 ? 65 : 97;
            let shift = key[keyIndex % key.length].toUpperCase().charCodeAt(0) - 65;
            result += String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
}

function downloadResult(result, fileName) {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
