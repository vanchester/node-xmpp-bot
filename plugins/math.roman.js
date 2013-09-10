exports.roman = {
    name: 'roman',
    group: 'Math',
    about: 'Convert numbers between roman and arabic systems',
    help: 'roman <NUMBER>',
    enabled: 1,
    run: function(params) {
        if (!params[0]) {
            return this.help;
        }

        if (/^[\d]+$/.test(params[0])) {
            return toRoman(params[0]);
        } else if (/^[MDCLXVI]+$/i.test(params[0])) {
            return toArabic(params[0]);
        } else {
            return 'Wrong number';
        }
    }
};

function toRoman(num)
{
    var onesArray = ["I","II","III","IV","V","VI","VII","VIII","IX"];
    var tensArray = ["X","XX","XXX","XL","L","LX","LXX","LXXX","XC"];
    var hundredsArray = ["C","CC","CCC","CD","D","DC","DCC","DCCC","CM"];

    var ones = num % 10;
    num = (num - ones) / 10;
    var tens = num % 10;
    num = (num - tens) / 10;
    var hundreds = num % 10;
    num = (num - hundreds) / 10;

    var roman = "";

    for (i=0; i < num; i++){
        roman += "M";
    }

    if (hundreds) {
        roman += hundredsArray[hundreds-1];
    }
    if (tens) {
        roman += tensArray[tens-1];
    }
    if (ones) {
        roman += onesArray[ones-1];
    }

    return roman;
}

function toArabic (num)
{
    var arabic = 0;
    var lastDigit = 1000;

    var digit;
    for (i = 0; i < num.length; i++) {
        switch (num.substr(i, 1).toUpperCase()) {
            case 'I': digit = 1; break;
            case 'V': digit = 5; break;
            case 'X': digit = 10; break;
            case 'L': digit = 50; break;
            case 'C': digit = 100; break;
            case 'D': digit = 500; break;
            case 'M': digit = 1000; break;
        }

        if (lastDigit < digit) {
            arabic -= 2 * lastDigit;
        }

        lastDigit = digit;
        arabic += lastDigit;
    }

    return arabic;
}