import { readdir, mkdir, rename } from 'fs/promises';
import { join, parse } from 'path';
import { existsSync, statSync } from 'fs';
import sizeOf from 'image-size';
import { program } from 'commander';
import { getKeyByValue, getClosestRatio, MAINSTREAM_RATIO } from './utils.js';

const popData = (img, imgPath) => {
  const path = join(imgPath, img);
  const size = sizeOf(path);
  return {
    path,
    ...size,
    ratio: size.width / size.height,
    closestRatio: getClosestRatio(size),
  };
};

const getImgInfo = async (imgPath) => {
  const dirContent = await readdir(imgPath);
  const rawImages = dirContent.filter((content) =>
    statSync(join(imgPath, content)).isFile(),
  );
  return rawImages.map((img) => popData(img, imgPath));
};

const createDirs = (path, subDir) => {
  Object.keys(MAINSTREAM_RATIO).map((ratio) => {
    const finalPath = subDir ? join(path, ratio) : ratio;
    if (!existsSync(finalPath)) mkdir(finalPath);
    else return;
  });
};

const moveImages = ({ path, type, closestRatio }, subDir) => {
  const newDirName = getKeyByValue(MAINSTREAM_RATIO, closestRatio);
  const pathInfo = parse(path);
  const newPath = join(
    subDir ? pathInfo.dir : '',
    newDirName,
    pathInfo.name + '.' + type,
  );
  rename(path, newPath);
};

const start = async (imgPath, subDir) => {
  const imgs = await getImgInfo(imgPath);
  if (imgs.length !== 0) {
    createDirs(imgPath, subDir);
    imgs.forEach((img) => {
      moveImages(img, subDir);
    });
  } else console.log('There is no images in the directory');
};

program
  .option('-p, --path <type>', 'Specify images path', './img/')
  .option(
    '-s, --subdir <type>',
    'Set to true, images will be moved inside path value else in the directory of the script',
    true,
  );

const options = program.opts();
program.parse(process.argv);

start(options.path, options.subdir === 'false' ? false : true);
