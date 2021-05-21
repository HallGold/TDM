export default {

    resolve(layouts, panels, components) {
        let coms = {};
        for (let layout in layouts) {
            if (layouts[layout].components) {
                coms = {...coms, ...layouts[layout].components}
            }
        }
        for (let panel in panels) {
            if (panels[panel].components) {
                coms = {...coms, ...panels[panel].components}
            }
        }
        for (let component in components) {
            if (components[component].components) {
                coms = {...coms, ...components[component].components}
            }
        }

        return coms
    }

}