const core = require('@actions/core');
const os = require('os');
const { execSync } = require('child_process');
const { mkdirSync, readFileSync, writeFileSync } = require('fs');

function exec(cmd) {
    console.info(`> ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
}

try {
    const version = core.getInput('version');
    console.log(`Installing foundationdb ${version} (${os.platform()})!`);
    let base_url = `https://www.foundationdb.org/downloads/${version}`;
    switch (os.platform()) {
        case 'linux': {
            let client_url = `${base_url}/ubuntu/installers/foundationdb-clients_${version}-1_amd64.deb`;
            exec(`curl -O ${client_url}`);
            exec(`sudo dpkg -i foundationdb-clients_${version}-1_amd64.deb`);

            let server_url = `${base_url}/ubuntu/installers/foundationdb-server_${version}-1_amd64.deb`;
            exec(`curl -O ${server_url}`);
            exec(`sudo dpkg -i foundationdb-server_${version}-1_amd64.deb`);
            break;
        }
        case 'darwin': {
            let url = `${base_url}/macOS/installers/FoundationDB-${version}.pkg`;
            exec(`curl -O ${url}`);
            exec(`sudo installer -pkg FoundationDB-${version}.pkg -target /`);
            break;
        }
    }

} catch (error) {
    core.setFailed(error.message);
}
