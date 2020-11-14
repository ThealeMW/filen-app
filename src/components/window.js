import { Plugins } from "@capacitor/core"
import { modalController, popoverController, menuController, alertController, loadingController, actionSheetController } from "@ionic/core"
import * as language from "../utils/language"
import * as utils from "../utils/utils"

export function windowRouter(){
    window.onhashchange = async () => {
        if(window.currentHref !== window.location.href){
            window.currentHref = window.location.href

            this.setState({
                currentHref: window.currentHref
            })

            let routeEx = window.location.hash.split("/")

            if(this.state.isLoggedIn){
                if(routeEx[1] == "base" || routeEx[1] == "shared-in" || routeEx[1] == "shared-out" || routeEx[1] == "trash"){
                    await this.updateItemList()
    
                    let foldersInRoute = routeEx.slice(2)
    
                    if(foldersInRoute.length > 0){
                        let lastFolderInRoute = foldersInRoute[foldersInRoute.length - 1]
    
                        if(window.customVariables.cachedFolders[lastFolderInRoute]){
                            this.setState({
                                mainToolbarTitle: window.customVariables.cachedFolders[lastFolderInRoute].name,
                                showMainToolbarBackButton: true
                            })
                        }
                        else{
                            this.setState({
                                mainToolbarTitle: language.get(this.state.lang, "myCloud"),
                                showMainToolbarBackButton: false
                            })
                        }
                    }
                    else{
                        this.setState({
                            mainToolbarTitle: language.get(this.state.lang, "myCloud"),
                            showMainToolbarBackButton: false
                        })
                    }
                }
            }
        }
    }
}

export function setupWindowFunctions(){
    window.customFunctions = {}
    window.customVariables = {}

    window.customVariables.itemList = []
    window.customVariables.lang = this.state.lang
    window.customVariables.cachedFolders = {}
    window.customVariables.cachedFiles = {}
    window.customVariables.keyUpdateInterval = undefined
    
    window.onresize = () => {
        this.setState({
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth
        })
    }

    window.customFunctions.dismissActionSheet = async (all = false) => {
        if(all){
            await actionSheetController.dismiss()

            return true
        }

        try{
            let actionSheet = await actionSheetController.getTop()

            return actionSheet.dismiss()
        }
        catch(e){
            return console.log(e)
        }
    }

    window.customFunctions.dismissPopover = async (all = false) => {
        if(all){
            await popoverController.dismiss()

            return true
        }

        try{
            let popover = await popoverController.getTop()

            return popover.dismiss()
        }
        catch(e){
            return console.log(e)
        }
    }

    window.customFunctions.dismissModal = async (all = false) => {
        if(all){
            await modalController.dismiss()

            return true
        }

        try{
            let modal = await modalController.getTop()

            return modal.dismiss()
        }
        catch(e){
            return console.log(e)
        }
    }

    window.customFunctions.dismissLoader = async (all = false) => {
        if(all){
            await loadingController.dismiss()

            return true
        }

        try{
            let loader = await loadingController.getTop()

            return loader.dismiss()
        }
        catch(e){
            return console.log(e)
        }
    }

    window.customFunctions.selectAllItems = () => {
        let items = []

        for(let i = 0; i < this.state.itemList.length; i++){
            let item = this.state.itemList[i]

            item.selected = true

            items.push(item)
        }

        this.setState({
            itemList: items,
            selectedItems: items.length
        })

        return window.customFunctions.dismissPopover()
    }

    window.customFunctions.unselectAllItems = () => {
        let items = []

        for(let i = 0; i < this.state.itemList.length; i++){
            let item = this.state.itemList[i]

            item.selected = false

            items.push(item)
        }

        this.setState({
            itemList: items,
            selectedItems: 0
        })

        return window.customFunctions.dismissPopover()
    }

    window.customFunctions.refreshItemList = () => {
        this.updateItemList()

        return window.customFunctions.dismissPopover()
    }

    window.customFunctions.hideSidebarMenu = async () => {
        let mainMenu = await menuController.get("sideBarMenu")

        return mainMenu.close()
    }

    window.customFunctions.openRegisterModal = () => {
        return this.showRegister()
    }

    window.customFunctions.doLogout = async () => {
        await Plugins.Storage.set({ key: "isLoggedIn", value: "false" })
        await Plugins.Storage.set({ key: "userAPIKey", value: "" })
        await Plugins.Storage.set({ key: "userEmail", value: "" })
        await Plugins.Storage.set({ key: "userMasterKeys", value: JSON.stringify([]) })
        await Plugins.Storage.set({ key: "userPublicKey", value: "" })
        await Plugins.Storage.set({ key: "userPrivateKey", value: "" })

        this.setState({ isLoggedIn: false })

        return this.showLogin()
    }

    window.customFunctions.doLogin = async () => {
        let email = document.getElementById("login-email").value
        let password = document.getElementById("login-password").value
        let twoFactorKey = document.getElementById("login-2fa").value

        if(!email || !password){
            let alert = await alertController.create({
                header: "",
                subHeader: "",
                message: language.get(this.state.lang, "loginInvalidInputs"),
                buttons: [language.get(this.state.lang, "alertOkButton").toUpperCase()]
            })

            return alert.present()
        }

        if(twoFactorKey.length == 0){
            twoFactorKey = "XXXXXX"
        }

        let loading = await loadingController.create({
            message: ""
        })
    
        loading.present()

        try{
            var res = await utils.apiRequest("POST", "/v1/login", {
                email,
                password,
                twoFactorKey
            })
        }
        catch(e){
            console.log(e)

            window.customFunctions.dismissLoader()

            let alert = await alertController.create({
                header: "",
                subHeader: "",
                message: language.get(this.state.lang, "apiRequestError"),
                buttons: [language.get(this.state.lang, "alertOkButton").toUpperCase()]
            })

            return alert.present()
        }

        if(!res.status){
            window.customFunctions.dismissLoader()

            let alert = await alertController.create({
                header: "",
                subHeader: "",
                message: language.get(this.state.lang, "loginWrongCredentials"),
                buttons: [language.get(this.state.lang, "alertOkButton").toUpperCase()]
            })

            return alert.present()
        }

        await Plugins.Storage.set({ key: "isLoggedIn", value: "true" })
        await Plugins.Storage.set({ key: "userAPIKey", value: res.data.apiKey })
        await Plugins.Storage.set({ key: "userEmail", value: email })
        await Plugins.Storage.set({ key: "userMasterKeys", value: JSON.stringify([utils.hashFn(password)]) })

        window.customFunctions.dismissLoader(true)
        window.customFunctions.dismissModal(true)

        return this.doSetup()
    }
}