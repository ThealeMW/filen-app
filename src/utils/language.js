let translations = {}

translations['en'] = {}

translations['en']['close'] = "close"
translations['en']['cancel'] = "cancel"
translations['en']['refresh'] = "refresh"
translations['en']['trashItem'] = "trash"
translations['en']['moveItem'] = "move"
translations['en']['myCloud'] = "My Cloud"
translations['en']['loginTitle'] = "Sign in"
translations['en']['registerTitle'] = "Create an account"
translations['en']['or'] = "or"
translations['en']['loginButton'] = "Sign in"
translations['en']['registerButton'] = "Create an account"
translations['en']['registerLink'] = "Create an account (First 10 GB free)"
translations['en']['emailPlaceholder'] = "Email address"
translations['en']['passwordPlaceholder'] = "Password"
translations['en']['2faPlaceholder'] = "2FA code (leave empty if disabled)"
translations['en']['loginInvalidInputs'] = "Invalid email address and password"
translations['en']['alertOkButton'] = "ok"
translations['en']['loginWrongCredentials'] = "Wrong email, password or 2FA code"
translations['en']['apiRequestError'] = "Request error, please try again later"

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