export const itemMixin = {
    methods: {
        processText: function (item, mode = 0) {
            let gudText = item.text;
            let count = this.$lodash.countBy(gudText)['$'] || 0;
            if (count > 0) {
                for (let i = 1; i <= count; i++) {
                    gudText = gudText.split("$" + i).join("<b>" + item.values[mode][i] + "</b>")
                }
            }
            return gudText;
        },
    }
}