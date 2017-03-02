### POST /projects
Create a new project
- Request

```json
{
    "name": "sedy"
}
```

- Response

```json
{
  "id": "235258fc-ce71-46f0-b41f-aa73fd1c7c5e",
  "name": "sedy",
  "access_key": "LVSVTLFSKNMATLXEYQJU",
  "read_token": "0QYisXy1iNpuy2XqRI4vMFP3gg60Qs5j3xeW1HeP",
  "write_token": "A1vRnpKyW7I10IibYCYamkfvxMBOb86Q7CTokWck",
  "environments": [
    {
      "id": "85b6a307-b77b-4891-a98a-2d0f862890a3",
      "name": "default",
      "configurations": [],
      "totalcount": "1"
    }
  ]
}
```

### DELETE /projects/{id}
Delete project
- Response

```json
{
  "id": "0bb0a656-c5cd-4a58-a821-60d3d4b20c60",
  "name": "sedy 2",
  "access_key": "QDQXWYMXXQMPRDOCXMQH",
  "read_token": "a3oAiwn1hr9bWq2rQlHvlCwn3k5cyOTEM9XUgdnX",
  "write_token": "JobqQ6JHLaXb2YD2T92KVeSvtj8X0WuMrSBNcyT5"
}
```
### PUT /projects/{id}
Rename project
- Request

```json
{
	"name": "sedy 2"
}
```

- Response

```json
{
  "id": "0bb0a656-c5cd-4a58-a821-60d3d4b20c60",
  "name": "sedy 2",
  "access_key": "QDQXWYMXXQMPRDOCXMQH",
  "read_token": "a3oAiwn1hr9bWq2rQlHvlCwn3k5cyOTEM9XUgdnX",
  "write_token": "JobqQ6JHLaXb2YD2T92KVeSvtj8X0WuMrSBNcyT5"
}
```
### GET /projects/{id}/environments
List environments of a project
- Response

```json
[
  {
    "id": "85b6a307-b77b-4891-a98a-2d0f862890a3",
    "name": "default",
    "configurations": [],
    "totalcount": "1"
  }
]
```
### POST /projects/{id}/environments
Add new environment to project
- Request

```json
{
    "name": "production"
}
```

- Response

```json
{
  "id": "7636fbfb-0103-406c-b58b-1f7101b820ea",
  "name": "production"
}
```
### PUT /projects/{id}/environments/{name}
Rename environment of a project
- Request

```json
{
	"name": "staging"
}
```

- Response

```json
{
  "id": "7636fbfb-0103-406c-b58b-1f7101b820ea",
  "name": "staging"
}
```
### DELETE /project/{id}/environments/{name}
Delete environment of a project
- Request

```json
{
}
```

- Response

```json
{
}
```
### GET /projects/{id}/environments/{name}/configurations/{name}?all
List history of configuration (tagged versions / all switch = everything)
- Request

```json
{
}
```

- Response

```json
{
}
```
### GET /projects/{id}/environments/{name}/configurations/{name}/{tag}
Get {tag} version of configuration, tag is either a tag name or a hash
- Request

```json
{
}
```

- Response

```json
{
}
```
### POST /projects/{id}/environments/{name}/configurations/{name}
Create new configuration for environment (includes body and tag)
- Request

```json
{
}
```

- Response

```json
{
}
```
### DELETE /project/{id}/environments/{name}/configurations/{name}
Delete configuration for environment
- Request

```json
{
}
```

- Response

```json
{
}
```
