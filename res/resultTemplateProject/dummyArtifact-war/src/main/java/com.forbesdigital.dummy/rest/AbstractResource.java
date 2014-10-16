package com.forbesdigital.dummy.rest;

import java.lang.annotation.Annotation;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

/**
 * Useful utilities for REST resources.
 *
 * @author Firstname Lastname <firstname.lastname@localhost.localdomain>
 */
public class AbstractResource {
	/**
	 * Information about the request
	 */
	@Inject
	protected HttpServletRequest request;
}
