package {{ package }}.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import java.io.Serializable;

/**
 * User that has access to the {{ userClassNamePrefix | upper }} in order to manage configuration of applications and so on.
 *
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
@Entity
@NamedQueries({
	@NamedQuery(
		name = QueryNames.{{ userClassNamePrefix | upper }}USER_FINDBYEMAIL,
		query = "SELECT u FROM {{ userClassNamePrefix | capitalize }}User u WHERE u.email = :email"
	)
})
public class {{ userClassNamePrefix | capitalize }}User implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String hashedPassword;

	@Column(nullable = false)
	private String firstName;

	@Column(nullable = false)
	private String lastName;

	@Column(nullable = false)
	private String salt;

	public {{ userClassNamePrefix | capitalize }}User() { }

	public {{ userClassNamePrefix | capitalize }}User(String email, String hashedPassword, String salt, String firstName, String lastName) {
		this.email = email;
		this.hashedPassword = hashedPassword;
		this.salt = salt;
		this.firstName = firstName;
		this.lastName = lastName;
	}

	public Long getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getHashedPassword() {
		return hashedPassword;
	}

	public void setHashedPassword(String hashedPassword) {
		this.hashedPassword = hashedPassword;
	}

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

	public String getSalt() {
		return salt;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}
}
