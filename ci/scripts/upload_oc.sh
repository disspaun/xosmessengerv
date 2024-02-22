#!/usr/bin/env bash
set -ex

MODE=${1:-release}

if [ $MODE = 'release' ]; then
    PATH_DIR=$TAG
else
    PATH_DIR=$CI_COMMIT_SHORT_SHA
fi

OC_DIR=/home/gitlab-runner/test_oc
DEPLOY_DIR=${OC_DIR}/mobile-rn/${MODE}/$PATH_DIR
KEEP_RELEASES=10

mkdir -p ${DEPLOY_DIR}
cp -Rv android/app/build/outputs/apk/release/*.apk ${DEPLOY_DIR}
owncloudcmd -s --non-interactive -u prod_test -p ${OC_PASSWORD} ${OC_DIR} https://46.28.205.130/owncloud/remote.php/webdav

# Clean up old releases
cd ${OC_DIR}/mobile-rn/${MODE}
ls -tr | head -n -${KEEP_RELEASES} | xargs rm -rf
