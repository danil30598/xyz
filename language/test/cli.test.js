'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createProject, projectEntry } = require('../runtime/cli');

test('creates a runnable project without overwriting an existing folder', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'xyz-new-'));
  try {
    const project = createProject('MyGame', root);
    assert.equal(projectEntry(project), path.join(project, 'main.xyz'));
    assert.equal(JSON.parse(fs.readFileSync(path.join(project, 'xyz.json'), 'utf8')).entry, 'main.xyz');
    assert.ok(fs.statSync(path.join(project, 'xyz_modules')).isDirectory());
    assert.throws(() => createProject('MyGame', root), /уже существует/);
    assert.throws(() => createProject('../bad', root), /Имя проекта/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('uses main.xyz when a project config is absent', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'xyz-entry-'));
  try {
    fs.writeFileSync(path.join(root, 'main.xyz'), 'print("ok")');
    assert.equal(projectEntry(root), path.join(root, 'main.xyz'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
