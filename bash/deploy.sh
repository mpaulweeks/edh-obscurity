cd edh-obscurity-app

npm run build
mkdir ../docs
rm -r ../docs
mkdir ../docs
cp -a build/ ../docs
# echo 'edh-obscurity.mpaulweeks.com' > ../docs/CNAME

cd ..
git add .
git commit -m 'deploy'
git push
