"use strict"

var presets = {}

function addPreset() {
    var name = $('#presetnameinput').val()

    var diceData = getDiceSetup()
    diceData.name = name.replace(/\s+/g, '')

    if (name.length > 0) {
        if (name in presets) {
            //update existing
            presets[name].data = diceData
            presets[name].update()
        } else {
            //new
            presets[name] = new PresetItem(diceData, "presetItemContainer")
        }
    }

    setPresets()
}

function getPresets() {
    var storedPresetString = localStorage.getItem('userDicePresets')

    if (storedPresetString != null) {
        let presetDatas = JSON.parse(storedPresetString)
        for (let o of presetDatas) {
            presets[o.name] = new PresetItem(o, "presetItemContainer")
        }
    }
}
function setPresets() {
    let presetDatas = []
    for (let p in presets) {
        presetDatas.push(presets[p].data)
    }

    let presetDataString = JSON.stringify(presetDatas)
    localStorage.setItem('userDicePresets', presetDataString)
}

function loadPreset(id) {
    setDiceSetup(presets[id].data)
    $('#presetnameinput').val(id)
}

function removePreset(id) {
    presets[id].remove()
    delete presets[id]

    setPresets()
}


class PresetItem {
    constructor(data, eleCont) {
        this.data = data

        //main element
        this.presetItem = document.createElement("div")
        this.presetItem.classList.add("presetItem")
        this.presetItem.classList.add("savedPreset")
        this.presetItem.id = data.name
        let parent = document.getElementById(eleCont)
        parent.appendChild(this.presetItem)

        $("#" + data.name).hide()
        
        //title
        let title = document.createElement("p")
        title.textContent = data.name
        title.classList.add("presetItemTitle")
        this.presetItem.appendChild(title)

        //buttons
        let loadButton = document.createElement("input")
        loadButton.classList.add("presetItemButton")
        loadButton.classList.add("diceButton")
        loadButton.type = "button"
        loadButton.value = "Load"
        loadButton.onclick = () => {
            loadPreset(this.data.name)
        }
        this.presetItem.appendChild(loadButton)

        let remButton = document.createElement("input")
        remButton.classList.add("presetItemButton")
        remButton.classList.add("diceButton")
        remButton.type = "button"
        remButton.value = "Remove"
        remButton.onclick = () => {
            removePreset(this.data.name)
        }
        this.presetItem.appendChild(remButton)

        $("#" + data.name).fadeIn("fast")
    }

    remove() {
        $("#" + this.data.name).fadeOut("fast", () => {
            this.presetItem.remove()
        })
    }

    update() {
        // $("#" + this.data.name).animate({
        //     borderColor: '#98eb34'
        // }, 500, "linear", function() {
        //     console.log("done")
        // });

        setPresets()
    }
}

