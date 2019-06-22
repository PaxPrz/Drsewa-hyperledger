# drsewa

Codecamp Sagarmatha engineering college

export COMPOSER_PROVIDERS='{
    "github":{
        "provider": "github",
        "module": "passport-github",
        "clientID": "c1e68c173a11df12c8c2",
        "clientSecret": "928f5c469ca1d34a2ba2219abc380fa43ace7519",
        "authPath": "/auth/github",
        "callbackURL": "/auth/github/callback",
        "successRedirect": "/",
        "failureRedirect": "/"
    }
}'

export COMPOSER_PROVIDERS='{"github":{"provider":"github","module":"passport-github","clientID":"c1e68c173a11df12c8c2","clientSecret":"928f5c469ca1d34a2ba2219abc380fa43ace7519","authPath":"/auth/github","callbackURL":"/auth/github/callback","successRedirect":"/","failureRedirect":"/"}}'

npm install -g passport-github

composer-rest-server --card admin@drsewa -n "never" -p 3000 -a true -m true

localhost:3000/auth/github

