FROM python:3.11.1-slim-buster

RUN pip install websockets
ADD server.py server.py

CMD python server.py