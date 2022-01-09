/**
 * @param {Object} source 
 * @returns {Object} 
 */
export default function loadFiles(source) {
  const media = { gui: {}, background: {}, images: {}, audio: {} };

  const totalFiles = Object.values(source).map(o => Object.values(o)).flat().length;
  let loadedFiles = 0;

  for (const type in source) {
    Object.entries(source[type]).forEach(([name, prop]) => {
      if (type == 'gui') {
        media.gui[name] = new Image();
        media.gui[name].onload = onLoad();
        media.gui[name].src = prop.src;
        media.gui[name].width = prop.width;
        media.gui[name].height = prop.height;
      }
      if (type == 'background') {
        media.background[name] = new Image();
        media.background[name].onload = onLoad();
        media.background[name].src = prop.src;
        media.background[name].moving = prop.moving;
      }
      if (type == 'spritesheets') {
        media.images[name] = new Image();
        media.images[name].onload = onLoad();
        media.images[name].src = prop.src;
      }
      if (type == 'audio') {
        media.audio[name] = new Audio(prop.src);
        media.audio[name].oncanplaythrough = onLoad();
        media.audio[name].loop = prop.loop;
      }
    });
  }

  function onLoad() { if (++loadedFiles >= totalFiles) { return media; } }
  return onLoad();
};