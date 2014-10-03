package {{ package }}.to.{{ userClassNamePrefix | lower }}user;

/**
 * Transfer object for user.
 *
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
public class {{ userClassNamePrefix | capitalize }}UserCreateTO {
	private String firstName;

	private String lastName;

	private String email;

	private String password;

	private String repeatedPassword;

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

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

	public String getRepeatedPassword() {
		return repeatedPassword;
	}

	public void setRepeatedPassword(String repeatedPassword) {
		this.repeatedPassword = repeatedPassword;
	}
}
