module.exports = {
    apps: [
        {
            name: "main application",
            script: "index.js",
            exec_mode: 'cluster'
        },
        {
            name: "ocrFilter",
            script: "./filters/ocrFilter.js",
            instances: "2",
            exec_mode: 'cluster',
            // restart_delay: 5000
        },
        {
            name: "translateFilter",
            script: "./filters/translateFilter.js",
            instances: "1",
            exec_mode: 'cluster',
            // restart_delay: 5000
        },
        {
            name: "pdfFilter",
            script: "./filters/pdfFilter.js",
            instances: "2",
            exec_mode: 'cluster',
            // restart_delay: 5000 
        }
    ]
}