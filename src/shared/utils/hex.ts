export function truncate_hex(value: string, visible_length = 14) {
  if (value.length <= visible_length * 2) {
    return value;
  }

  return `${value.slice(0, visible_length)}...${value.slice(-visible_length)}`;
}
