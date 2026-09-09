export function rectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function getSpikeRects(level, groundY) {
  const spikes = [];

  for (const obstacle of level.obstacles) {
    const [x, type] = obstacle;
    let count = 1;

    if (type === 'double') count = 2;
    if (type === 'triple') count = 3;

    for (let i = 0; i < count; i += 1) {
      spikes.push({
        x: x + i * 42,
        y: groundY - 42,
        width: 42,
        height: 42,
      });
    }
  }

  return spikes;
}
