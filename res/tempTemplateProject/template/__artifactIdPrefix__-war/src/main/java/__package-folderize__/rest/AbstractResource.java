package {{ package }}.rest;

import java.lang.annotation.Annotation;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

/**
 * Useful utilities for REST resources.
 *
 * @author {{ authorFirstName }} {{ authorLastName }} <{{ authorEmail }}>
 */
public class AbstractResource {
	/**
	 * Information about the request
	 */
	@Inject
	protected HttpServletRequest request;
}
