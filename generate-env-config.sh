#!/bin/sh

# Default output file
OUTPUT_FILE="/usr/share/nginx/html/coach/env-config.js"

echo "window.ENV_CONFIG = {" > $OUTPUT_FILE

# List of environment variables to include
# You can add more variables here as needed
vars="DATABASE_URL VITE_NEON_DATABASE_URL"

for varname in $vars; do
    # Get the value of the environment variable
    eval varvalue=\$$varname
    
    # If the value exists, add it to the config file
    if [ ! -z "$varvalue" ]; then
        echo "  \"$varname\": \"$varvalue\"," >> $OUTPUT_FILE
    fi
done

echo "};" >> $OUTPUT_FILE

echo "Generated $OUTPUT_FILE with environment variables."
