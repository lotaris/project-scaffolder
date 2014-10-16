package {{ package }}.model;

/**
 * The <code>QueryNames</code> provide the facility to help
 * the refactoring of the query names.
 *
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
public final class QueryNames {
	/**
	 * Default constructor (hidden for utility class)
	 */
	private QueryNames() {}

	///
	// User queries
	///
	public static final String {{ userClassNamePrefix | upper }}USER_FINDBYEMAIL = "{{ serverShortName | lower }}.{{ userClassNamePrefix | lower }}User.findByEmail";
}
