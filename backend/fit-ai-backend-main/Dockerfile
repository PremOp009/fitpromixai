FROM python:3.10-slim

WORKDIR /app

RUN pip install --no-cache-dir fastapi uvicorn pydantic requests openai huggingface_hub openenv-core

COPY . .

# Let the environment inject the port, fallback to 7860
ENV PORT=7860
EXPOSE $PORT

ENV PYTHONPATH=/app

CMD ["python", "-m", "server.app"]
