package com.cooksys.ftd.chat.server;

import java.io.BufferedReader;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClientHandler implements Runnable, Closeable {

	Logger log = LoggerFactory.getLogger(ClientHandler.class);

	private Socket client;
	private PrintWriter writer;
	private BufferedReader reader;

	public ClientHandler(Socket client) throws IOException {
		super();
		this.client = client;
		this.reader = new BufferedReader(new InputStreamReader(client.getInputStream()));
		this.writer = new PrintWriter(client.getOutputStream(), true);
	}

	@Override
	public void run() {
		try {
			log.info("handling client {}", this.client.getRemoteSocketAddress());
			while (!this.client.isClosed()) {
				String echo = reader.readLine();
				log.info("received message [{}] from client {}, echoing...", echo,
						this.client.getRemoteSocketAddress());
				Thread.sleep(500);
				writer.print(echo);
				writer.flush();
			}
			this.close();
		} catch (IOException | InterruptedException e) {
			log.error("Handler fail! oh noes :(", e);
		}
	}

	@Override
	public void close() throws IOException {
		log.info("closing connection to client {}", this.client.getRemoteSocketAddress());
		this.client.close();
	}

}
