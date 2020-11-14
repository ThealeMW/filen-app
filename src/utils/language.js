let translations = {}

translations['en'] = {}

translations['en']['close'] = "Close"
translations['en']['cancel'] = "Cancel"
translations['en']['refresh'] = "Refresh"
translations['en']['trashItem'] = "Trash"
translations['en']['moveItem'] = "Move"
translations['en']['myCloud'] = "My Cloud"
translations['en']['loginTitle'] = "Sign in"
translations['en']['registerTitle'] = "Create an account"
translations['en']['or'] = "or"
translations['en']['loginButton'] = "Sign in"
translations['en']['registerButton'] = "Create account"
translations['en']['registerLink'] = "Create an account (First 10 GB free)"
translations['en']['loginLink'] = "Sign in"
translations['en']['passwordRepeatPlaceholder'] = "Repeat password"
translations['en']['emailPlaceholder'] = "Email address"
translations['en']['passwordPlaceholder'] = "Password"
translations['en']['2faPlaceholder'] = "2FA code (leave empty if disabled)"
translations['en']['loginInvalidInputs'] = "Invalid email address and password"
translations['en']['alertOkButton'] = "OK"
translations['en']['loginWrongCredentials'] = "Wrong email, password or 2FA code"
translations['en']['apiRequestError'] = "Request error, please try again later"
translations['en']['registerInvalidFields'] = "Invalid form fields"
translations['en']['registerPasswordAtLeast10Chars'] = "Your password needs to be at least 10 characters long"
translations['en']['registerPasswordsDoNotMatch'] = "Passwords do not match"
translations['en']['registerInvalidEmail'] = "Invalid email address"
translations['en']['registerEmailAlreadyRegistered'] = "This email address is already registered"
translations['en']['registerCouldNotSendEmail'] = "OK"
translations['en']['alertOkButton'] = "We could not send an email at this time, please try again later"
translations['en']['registerSuccess'] = "Account created, please confirm your email address by clicking the link we've sent to you"
translations['en']['registerInvalidInputs'] = "Invalid email address, password and confirm password"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"
translations['en']['alertOkButton'] = "OK"

module.exports = {
    get: (lang = "en", text, firstUpperCase = true, replaceFrom = [], replaceTo = []) => {
        let gotText = translations[lang][text]

        if(!gotText){
            return "NO_TRANSLATION_FOUND"
        }

        if(firstUpperCase){
            gotText = gotText.charAt(0).toUpperCase() + gotText.slice(1)
        }

        if(replaceFrom.length > 0 && replaceTo.length > 0){
            for(let i = 0; i < replaceFrom.length; i++){
                gotText = gotText.split(replaceFrom[i]).join(replaceTo[i])
            }
        }

        return gotText
    }
}