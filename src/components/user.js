import * as language from "../utils/language"
import * as utils from "../utils/utils"
import { Plugins } from "@capacitor/core"

export async function updateUserKeys(){
    if(!this.state.isLoggedIn){
        return false
    }

    const updatePubAndPrivKey = async () => {
        try{
            var res = await utils.apiRequest("POST", "/v1/user/keyPair/info", {
                apiKey: this.state.userAPIKey
            })
        }
        catch(e){
            return console.log(e)
        }

        if(!res.status){
            return console.log(res.message)
        }

        if(res.data.publicKey.length > 16 && res.data.privateKey.length > 16){
            let privKey = ""

            this.state.userMasterKeys.forEach((key) => {
                if(privKey.length == 0){
                    try{
                        let decrypted = utils.cryptoJSDecrypt(res.data.privateKey, key)

                        if(typeof decrypted == "string"){
                            if(decrypted.length > 16){
                                privKey = decrypted
                            }
                        }
                    }
                    catch(e){
                        console.log(e)

                        return
                    }
                }
            })

            if(privKey.length > 16){
                await Plugins.Storage.set({ key: "userPublicKey", value: res.data.publicKey })
                await Plugins.Storage.set({ key: "userPrivateKey", value: privKey })

                this.setState({
                    userPublicKey: res.data.publicKey,
                    userPrivateKey: privKey
                })

                return console.log("Public and private key updated.")
            }
            else{
                return console.log("Could not decrypt private key")
            }
        }
    }

    try{
        var res = await utils.apiRequest("POST", "/v1/user/masterKeys", {
            apiKey: this.state.userAPIKey,
            masterKeys: utils.cryptoJSEncrypt(this.state.userMasterKeys.join("|"), this.state.userMasterKeys[this.state.userMasterKeys.length - 1])
        })
    }
    catch(e){
        return console.log(e)
    }

    if(!res.status){
        return console.log(res.message)
    }

    let newKeys = ""

    this.state.userMasterKeys.forEach((key) => {
        try{
            if(newKeys.length == 0){
                let decrypted = utils.cryptoJSDecrypt(res.data.keys, key)

                if(typeof decrypted == "string"){
                    if(decrypted.length > 16){
                        newKeys = decrypted
                    }
                }
            }
        }
        catch(e){
            console.log(e)

            return
        }
    })

    if(newKeys.length > 16){
        await Plugins.Storage.set({ key: "userMasterKeys", value: JSON.stringify(newKeys.split("|")) })

        this.setState({
            userMasterKeys: newKeys.split("|")
        })

        console.log("Master keys updated.")
    }
    else{
        console.log("Could not decrypt master keys.")
    }

    return updatePubAndPrivKey()
}