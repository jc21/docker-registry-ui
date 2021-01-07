#!/bin/bash
set -eo pipefail
shopt -s nullglob

log() {
	local type="$1"; shift
	printf '%s [%s] [CMD]: %s\n' "$(date --rfc-3339=seconds)" "$type" "$*"
}
  
error() {
	log ERROR "$@" >&2
	exit 1
}

# usage: file_env VAR [DEFAULT]
#    ie: file_env 'XYZ_REGISTRY_PASS' 'example'
# (will allow for "$XYZ_REGISTRY_PASS_FILE" to fill in the value of
#  "$XYZ_DB_PASSWORD" from a file, especially for Docker's secrets feature)
file_env() {
	local var="$1"
	local fileVar="${var}_FILE"
	local def="${2:-}"
	if [ "${!var:-}" ] && [ "${!fileVar:-}" ]; then
		mysql_error "Both $var and $fileVar are set (but are exclusive)"
	fi
	local val="$def"
	if [ "${!var:-}" ]; then
		val="${!var}"
	elif [ "${!fileVar:-}" ]; then
		val="$(< "${!fileVar}")"
	fi
	export "$var"="$val"
	unset "$fileVar"
}

# Initialize values that might be stored in a file
docker_setup_env() {
	file_env 'REGISTRY_HOST' '%'
	file_env 'REGISTRY_SSL'
	file_env 'REGISTRY_DOMAIN'
	file_env 'REGISTRY_STORAGE_DELETE_ENABLED'
	file_env 'REGISTRY_USER'
	file_env 'REGISTRY_PASS'
}

docker_setup_env;
