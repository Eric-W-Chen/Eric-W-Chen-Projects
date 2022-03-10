package com.authentication.util;

public enum Role {

	ADMINISTRATOR("ADMINISTRATOR"), 
	MANAGER("MANAGER"),
	USER("USER");
	
	private final String text;
	private Role(final String text) {
		this.text = text;
	}
	public String toString() {
		return text;
	}
}
