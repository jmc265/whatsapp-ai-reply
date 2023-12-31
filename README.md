# WhatsApp AI Reply

Use [WhatsApp client library](https://wwebjs.dev/) and [OpenAI client library](https://github.com/openai/openai-node) to auto-reply to your instant messages.

>⚠️ Use at your own risk. The WhatsApp client library is unofficial and could get your blocked from the network.

## Usage

### Docker

```shell
docker run \
  -e SELF_CONTACT_ID=xxxxx@c.us \
  -e OPEN_AI_API_KEY=${OPEN_AI_API_KEY} \
  -e OPEN_AI_MODEL_KEY='gpt-4-1106-preview' \
  -e OPEN_AI_SYSTEM_PROMPT='You are an assistant who expands an emoji response to a message into a full text response' \
  -v ./whatsapp-auth:/mnt/auth-data \
  jmc265/whatsapp-ai-reply
```

Environment Variables:
- **SELF_CONTACT_ID** - This is the ID that WhatsApp uses to identify you. The value is outputted to the console when you start up the app for the first time.
- **OPEN_AI_API_KEY** - Your [API key](https://platform.openai.com/api-keys) for OpenAI 
- **OPEN_AI_MODEL_KEY** - Choose an [OpenAI model](https://platform.openai.com/docs/models)
- **OPEN_AI_SYSTEM_PROMPT** - The System prompt to append to each OpenAI request

Volume Mount:
- **/mnt/auth-data** - The location to store the WhatsApp authentication files

### Docker Compose

```yaml
version: "3.4"

services:
  whatsapp-ai-reply:
    image: jmc265/whatsapp-ai-reply
    container_name: whatsapp-ai-reply
    restart: unless-stopped
    volumes:
      - ./whatsapp-auth:/mnt/auth-data
    environment:
      SELF_CONTACT_ID: xxxxx@c.us
      OPEN_AI_API_KEY: ${OPEN_AI_API_KEY}
      OPEN_AI_MODEL_KEY: 'gpt-4-1106-preview'
      OPEN_AI_SYSTEM_PROMPT: 'You are an assistant who expands an emoji response to a message into a full text response'
```

### Local

Make sure you set the environment variables: `SELF_CONTACT_ID`, `OPEN_AI_API_KEY`, `OPEN_AI_MODEL_KEY`, `OPEN_AI_SYSTEM_PROMPT` and then:

```shell
npm install
npm run start
```