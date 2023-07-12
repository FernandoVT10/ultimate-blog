#!/bin/bash

bad_command_help() {
  echo "Usage: ./docker-helper ACTION ENVIRONMENT"
  echo ""
  echo "Try './docker-helper --help' for more information."
  exit 1
}

help() {
  echo ""
  echo "Usage: ./docker-helper ACTION ENVIRONMENT"
  echo ""
  echo "Helps to build, run, and stop the necessary containers."
  echo "" 
  echo "Actions:"
  echo "  run                   Runs all the containers"
  echo "  build                 Builds and downloads the necessary containers"
  echo "  stop                  Stops the containers"
  echo "  down                  Stops and removes the containers"
  echo ""
  echo "Environments:"
  echo "  -p, --production      Runs the ACTION for production"
  echo "  -d, --development     Runs the ACTION for development"
  echo ""
}

get_docker_env() {
  case "$1" in
    "-p" | "--production")
      echo "prod"
      ;;
    "-d" | "--development")
      echo "dev"
      ;;
    *)
      exit 1
      ;;
  esac
}

if [[ "$1" == "--help" ]]; then
  help
  exit 0
fi

if [[ ! $1 ]]; then
  bad_command_help
fi

docker_env=$(get_docker_env $2)

# check if get_docker_env exited with 1
if [[ $? -eq 1 ]]; then
  bad_command_help
fi

docker_yml_files="-f docker-compose.yml -f docker-compose.$docker_env.yml"

case "$1" in
  "run")
    docker compose $docker_yml_files up -d
    ;;
  "build")
    docker compose $docker_yml_files build
    ;;
  "stop")
    docker compose $docker_yml_files stop
    ;;
  "down")
    docker compose $docker_yml_files down
    ;;
  *)
    help
    ;;
esac

