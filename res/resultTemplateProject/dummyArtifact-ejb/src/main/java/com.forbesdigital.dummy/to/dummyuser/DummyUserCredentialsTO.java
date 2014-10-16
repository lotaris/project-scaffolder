package com.forbesdigital.dummy.to.dummyuser;

/**
 * Transfer object containing credentials for user.
 *
 * @author Firstname Lastname <firstname.lastname@localhost.localdomain>
 */
public class DummyUserCredentialsTO {
	private String email;

	private String password;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
