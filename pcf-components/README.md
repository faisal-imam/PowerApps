# Pre-requisites


# How to build
* >npm install
* >npm run build
* >npm start watch (debug locally)

# Connect to your enviornment
* >pac auth create --url <https://---.crm6.dynamics.com/>
* >pac pcf push --publisher-prefix <mbda>
  
# How to publish updates to your enviornment
* >msbuild /t:build
* >pac auth create --url <https://---.crm6.dynamics.com/>
* >pac pcf push --publisher-prefix <mbda>

