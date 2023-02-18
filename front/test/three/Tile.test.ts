import { Vector2 } from 'three';
import { Tile, TileType } from '../../src/three/Tile';

let tile: Tile;
const R = 1;
const HEIGHT = R * Math.sqrt(3);

beforeEach(() => {
    tile = new Tile(0, 0, R, R, TileType.STONE);
});

test('Center', () => {
    const inside = tile.doesOwnPoint(new Vector2(0, 0));
    expect(inside).toBeTruthy();
});

test('Corners', () => {
    // Left most. Clockwise
    let inside = tile.doesOwnPoint(new Vector2(-R, 0));
    expect(inside).toBeFalsy();
    inside = tile.doesOwnPoint(new Vector2(-R / 2, HEIGHT / 2));
    expect(inside).toBeFalsy();
    inside = tile.doesOwnPoint(new Vector2(R / 2, HEIGHT / 2));
    expect(inside).toBeFalsy();
    inside = tile.doesOwnPoint(new Vector2(R, 0));
    expect(inside).toBeFalsy();
    inside = tile.doesOwnPoint(new Vector2(R / 2, -HEIGHT / 2));
    expect(inside).toBeFalsy();
    inside = tile.doesOwnPoint(new Vector2(-R / 2, -HEIGHT / 2));
    expect(inside).toBeFalsy();
});

test('Corners in by 0.1', () => {
    let inside = tile.doesOwnPoint(new Vector2((-0.9 * R) / 2, (0.9 * HEIGHT) / 2));
    expect(inside).toBeTruthy();
    inside = tile.doesOwnPoint(new Vector2((0.9 * R) / 2, (0.9 * HEIGHT) / 2));
    expect(inside).toBeTruthy();
    inside = tile.doesOwnPoint(new Vector2((0.9 * R) / 2, (-0.9 * HEIGHT) / 2));
    expect(inside).toBeTruthy();
    inside = tile.doesOwnPoint(new Vector2((-0.9 * R) / 2, (-0.9 * HEIGHT) / 2));
    expect(inside).toBeTruthy();

    // Left and right corners
    inside = tile.doesOwnPoint(new Vector2(-R * 0.9, 0));
    expect(inside).toBeTruthy();
    inside = tile.doesOwnPoint(new Vector2(R * 0.9, 0));
    expect(inside).toBeTruthy();
});

test('Corners in by 0.1 for noise', () => {
    let noise = tile.getHeight(new Vector2((-0.9 * R) / 2, (0.9 * HEIGHT) / 2));
    expect(noise).toBeGreaterThan(0);
    noise = tile.getHeight(new Vector2((0.9 * R) / 2, (0.9 * HEIGHT) / 2));
    expect(noise).toBeGreaterThan(0);
    noise = tile.getHeight(new Vector2((0.9 * R) / 2, (-0.9 * HEIGHT) / 2));
    expect(noise).toBeGreaterThan(0);
    noise = tile.getHeight(new Vector2((-0.9 * R) / 2, (-0.9 * HEIGHT) / 2));
    expect(noise).toBeGreaterThan(0);

    // Left and right corners
    noise = tile.getHeight(new Vector2(-R * 0.9, 0));
    expect(noise).toBeGreaterThan(0);
    noise = tile.getHeight(new Vector2(R * 0.9, 0));
    expect(noise).toBeGreaterThan(0);
});
