# nativemessaging-mitm
Monster-in-the-middle native messaging and spy on your favorite browser extensions.

![Log file example](https://user-images.githubusercontent.com/14217083/124507082-b470dc80-ddd5-11eb-8546-95a5aea52377.png)

## Instructions

1. Clone this repository: `git clone https://github.com/KarimPwnz/nativemessaging-mitm`

2. Open `configs.json` and add the target app manifest path, the name of the target extension, and the app manifest's original script (path property):

```json
{
    "/Users/example/Library/Application Support/Mozilla/NativeMessagingHosts/example.json": {
        "name": "example",
        "originalScript": "/Applications/example.app/example"
    }
}
```

3. Change the path in your target's app manfiest to the repository's `mitm.js` script:

```json
{
    "name": "com.example",
    "description": "Example",
    "path": "/path/to/nativemessaging-mitm/mitm.js",
    "type": "stdio",
    "allowed_extensions": ["example@example.com"]
}

```

3. Done! Run the target browser extension and `logs/${extension_name}.log` will start logging:

```sh
$ tail -f /path/to/nativemessaging-mitm/logs/example.log

[1] ← (APP): {"hello":"extension"}

[2] → (EXTENSION): {"hello":"app"}

[3] ← (APP): {"okay":"bye"}

```
