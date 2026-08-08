#!/usr/bin/env bash

set -euo pipefail

BASE_PATH=/ pnpm --filter @workspace/meridian run build
BASE_PATH=/aldric-dashboard/ pnpm --filter @workspace/aldric-dashboard run build

dashboard_output="artifacts/aldric-dashboard/dist/public"
meridian_output="artifacts/meridian/dist/public"
dashboard_destination="$meridian_output/aldric-dashboard"

rm -rf "$dashboard_destination"
mkdir -p "$dashboard_destination"
cp -R "$dashboard_output"/. "$dashboard_destination"/