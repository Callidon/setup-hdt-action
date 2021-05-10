# setup-hdt-action
A Github action to setup the [C++ HDT library](https://github.com/rdfhdt/hdt-cpp) in your environment.

## Inputs

### `token`

**Required** GitHub token, used to retrieve [`rdfhdt/hdt-cpp`](https://github.com/rdfhdt/hdt-cpp) releases. Usually, you will want to use the built-in token `${{ secrets.GITHUB_TOKEN }}`.

### `hdt-tag`

**Required** Tag of the HDT release to use (`v1.0`, `v1.3.3`, etc).

### `source-path`

Location for storing the HDT source files. Defaults to the tagname (`./v1.3.3` for tag `v1.3.3`).

## Outputs

### `source-path`

Absolute path to the HDT source files.

## Example usage

```yaml
uses: Callidon/setup-hdt-action@v1
with:
  token: ${{ secrets.GITHUB_TOKEN }}
  hdt-tag: 'v1.3.3'
```
