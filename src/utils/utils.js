const CryptoJS = require("crypto-js")

module.exports = {
    getRandomArbitrary: (min, max) => {
        return Math.floor(Math.random() * (max - min) + min)
    },
    formatBytes: (bytes, decimals = 2) => {
        if(bytes === 0) return "0 Bytes"
    
        let k = 1024
        let dm = decimals < 0 ? 0 : decimals
        let sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    
        let i = Math.floor(Math.log(bytes) / Math.log(k))
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    },
    uuidv4: () => { // Public Domain/MIT
        let d = new Date().getTime();//Timestamp
        let d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    },
    generateRandomString: (length = 32) => {
        let result = ""
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    
        for(let i = 0; i < length; i++){
            result += characters.charAt(Math.floor(Math.random() * characters.length))
        }
    
        return result
    },
    generateRandomClassName: (length = 16) => {
        let result = ""
        let characters = "abcdefghijklmnopqrstuvwxyz"
    
        for(let i = 0; i < length; i++){
            result += characters.charAt(Math.floor(Math.random() * characters.length))
        }
    
        return result + "-" + result
    },
    getAPIServer: () => {
        let servers = [
            "https://api.filen.io",
            "https://api.filen-1.xyz",
            "https://api.filen-2.xyz",
            "https://api.filen-3.xyz",
            "https://api.filen-4.xyz",
            "https://api.filen-5.xyz"
        ]
    
        return servers[module.exports.getRandomArbitrary(0, (servers.length - 1))]
    },
    apiRequest: (method, endpoint, data = {}) => {
        return new Promise((resolve, reject) => {
            fetch(module.exports.getAPIServer() + endpoint, {
                method: method.toUpperCase(),
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then((response) => {
                response.json().then((obj) => {
                    return resolve(obj)
                }).catch((err) => {
                    console.log(err)

                    return reject(err)
                })
            }).catch((err) => {
                console.log(err)

                return reject(err)
            })
        })
    },
    getDownloadServer: () => {
        let servers = [
            "https://down.filen-1.xyz",
            "https://down.filen-2.xyz",
            "https://down.filen-3.xyz",
            "https://down.filen-4.xyz",
            "https://down.filen-5.xyz"
        ]
    
        return servers[module.exports.getRandomArbitrary(0, (servers.length - 1))]
    },
    getUploadServer: () => {
        let servers = [
            "https://up.filen-1.xyz",
            "https://up.filen-2.xyz",
            "https://up.filen-3.xyz",
            "https://up.filen-4.xyz",
            "https://up.filen-5.xyz"
        ]
    
        return servers[module.exports.getRandomArbitrary(0, (servers.length - 1))]
    },
    hashFn: (val) => {
        return CryptoJS.SHA1(CryptoJS.SHA512(val).toString()).toString()
    },
    cryptoJSEncrypt: (val, key) => {
        return CryptoJS.AES.encrypt(val, key).toString()
    },
    cryptoJSDecrypt: (val, key) => {
        return CryptoJS.AES.decrypt(val, key).toString(CryptoJS.enc.Utf8)
    },
    unixTimestamp: () => {
        return Math.floor((+new Date()) / 1000)
    },
    decryptCryptoJSFolderName: (str, userMasterKeys, uuid = undefined) => {
        if(uuid){
            if(window.customVariables.cachedFolders[uuid]){
                return window.customVariables.cachedFolders[uuid].name
            }
        }

        let folderName = "CON_NO_DECRYPT_POSSIBLE_NO_NAME_FOUND_FOR_FOLDER"

        userMasterKeys = userMasterKeys.reverse()

        let obj = undefined

        userMasterKeys.forEach((key) => {
            try{
                obj = JSON.parse(CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8))

                if(obj && typeof obj == "object"){
                    folderName = obj.name
                }
            }
            catch(e){
                return
            }
        })

        return folderName
    },
    decryptFileMetadata: (metadata, userMasterKeys, uuid = undefined) => {
        if(uuid){
            if(window.customVariables.cachedFiles[uuid]){
                let file = window.customVariables.cachedFiles[uuid]

                return {
                    name: file.name,
                    size: file.size,
                    mime: file.mime,
                    key: file.key
                }
            }
        }

        let fileName = ""
        let fileSize = 0
        let fileMime = ""
        let fileKey = ""
    
        userMasterKeys = userMasterKeys.reverse()
    
        userMasterKeys.forEach((key) => {
            try{
                let obj = JSON.parse(CryptoJS.AES.decrypt(metadata, key).toString(CryptoJS.enc.Utf8))
    
                if(obj && typeof obj == "object"){
                    fileName = obj.name
                    fileSize = parseInt(obj.size)
                    fileMime = obj.mime
                    fileKey = obj.key
                }
            }
            catch(e){
                return
            }
        })
    
        let obj = {
            name: fileName,
            size: fileSize,
            mime: fileMime,
            key: fileKey
        }
    
        return obj
    }
}