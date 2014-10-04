package {{ package }};

/**
 * Define the paths used in the different Rest services
 *
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
public final class RestPaths {
	/**
	 * Hidden constructor.
	 */
	private RestPaths() {}

	/**
	 * Define the path to access to the API application
	 */
	public static final String APPLICATION_API = "api";

	/**
	 * Defines the path to access the {{ userClassNamePrefix | lower }} users.
	 */
	public static final String API_USERS_PATH = "users";
}
