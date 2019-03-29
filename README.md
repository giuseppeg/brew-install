# 👌 brew-install

A node script to improve the `brew install` experience and allow to install specific versions of packages.

<small>Note this is a very naive implementation so it might not work all the time and it is meant for personal usage only.</small>

## Install

```
npm i -g brew-install
```

## Usage

### Install the latest version of a package

```
brew-install elixir
```

This is an alias for `brew install`.

### Install a specific version of a package

```
brew-install elixir@1.7.1
```

### List all* the avaliable version of a package

```
brew-install --ls elixir
```

* `brew-install` looks at the git history and uses the commit messages to determine the available versions - I warned you that this is a very naive implementation.

