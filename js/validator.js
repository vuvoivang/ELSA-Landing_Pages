// Constructor function
function Validator(options) {
    // Get nearest parent with corresponding selector
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var formElement = document.querySelector(options.form);
    var selectorRules = {};
    // Validation function
    function validate(inputElement, rule) {

        var message = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errMessage;
        // If there are many rules
        var rules = selectorRules[rule.selector];
        for (let i = 0; i < rules.length; i++) {
            // if catch error, stop and break
            switch (inputElement.type) {
                case "checkbox":
                    errMessage = rules[i](formElement.querySelector(rule.selector + ":checked")?.value);
                    break;
                default:
                    errMessage = rules[i](inputElement.value);
            }

            if (errMessage) break;
        }
        if (errMessage) {
            message.innerText = errMessage;
            getParent(inputElement, options.formGroupSelector).classList.add("invalid");
        }
        else {
            message.innerText = "";
            getParent(inputElement, options.formGroupSelector).classList.remove("invalid");
        }
        return !errMessage;
    }

    if (formElement) {
        formElement.onsubmit = function (e) {
            e.preventDefault();
            // Traverse all rules and validate
            var isValid = true;
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                isValid &= validate(inputElement, rule);
            })

            if (isValid) {
                // If all rules is validated
                if (typeof options.onSubmit === 'function') {
                    // selector with name and not have disabled attribute
                    var enablesInput = formElement.querySelectorAll('[name]:not([disabled])');
                    // convert NodeList to Array
                    var formValues = Array.from(enablesInput).reduce(function (value, input) {
                        switch (input.type) {
                            case "checkbox":
                                if (value[input.name] === undefined) value[input.name] = [];
                                if (input.matches(":checked")) value[input.name].push(input.value);
                                break;
                            default:
                                value[input.name] = input.value;
                        }

                        return value;

                    }, {})
                    options.onSubmit(formValues);
                }
            }

            else {
                // or use submit() method of form....
            }
        }
        // Traverse every rule and assign listener (blur, input)
        options.rules.forEach(function (rule) {
            // checkbox have 2+ input elements
            var inputElements = formElement.querySelectorAll(rule.selector);

            // Every input element can have many rules
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            Array.from(inputElements).forEach(function (inputElement) {
                if (inputElement) {
                    // handle onblur
                    inputElement.onblur = function () {
                        validate(inputElement, rule);

                    }
                    // handle oninput
                    inputElement.oninput = function () {
                        var message = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                        message.innerText = "";
                        getParent(inputElement, options.formGroupSelector).classList.remove("invalid");
                    }
                    

                }
            })

        })
    }
}
// define rules 
// Regulations of rules:
// 1. When err => message
// 2. When success => nothing (undefined)
Validator.isRequired = (selector, message) => {
    return {
        selector, test: function (value) {
            return value ? undefined : message || "Vui lòng nhập trường này";
        }
    };

}
Validator.isEmail = (selector, message) => {
    return {
        selector, test: function (value) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ? undefined : message || "Vui lòng nhập đúng định dạng email";
        }
    }
}
Validator.isPhone = (selector, message) => {
    return {
        selector, test: function (value) {
            return /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value) ? undefined : message || "Vui lòng nhập đúng định dạng số điện thoại";
        }
    }
}