import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.io.PrintWriter;
import java.io.BufferedReader; 
import java.io.InputStream; 
import java.io.Reader; 
import java.util.stream.*; 
import java.text.*; 
import java.util.*; 
import java.net.*; 
import java.util.Calendar; 
import java.util.Date; 
import java.nio.charset.Charset; 
import java.io.IOException; 
import org.json.*; 
import org.json.HTTP; 
import org.json.JSONObject;
import java.sql.*;

public class Test02MatrizV1 extends HttpServlet
{	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException{		
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		try {
			PrintWriter out = response.getWriter();	
			HttpSession session=request.getSession();
			String languaje = "en";

			String val1 = request.getRequestURI().toString();
			String[] val2 = val1.split("/");
			languaje = val2[1];
			session.setAttribute("languaje", languaje);						
			String html = "";
			/*html = "" +
			"<!doctype html>" +
			"<html lang=|" + languaje + "|>" +
			"  <head>" +
			"    <meta charset=|utf-8|>" +
			"	 <meta http-equiv=|Content-Type| content=|text/html; charset=utf-8| />" +
			"    <meta name=|viewport| content=|width=device-width, initial-scale=1, shrink-to-fit=no|>" +
			"    <meta name=|description| content=||>" +
			"    <meta name=|author| content=|JDG|>" +
			"    <meta name=|generator| content=|JDG|>" +
			"    <title>Eyebix</title>" +

			"    <link href=|../../assets/Test02MatrizV1/css/bootstrap.min.css| rel=|stylesheet| integrity=|sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC| crossorigin=|anonymous|>" +    
			"    <link href=|../../assets/Test02MatrizV1/css/Test02MatrizV1.css| rel=|stylesheet|>" +
			"    <link rel=|apple-touch-icon| href=|../../assets/Test02MatrizV1/img/apple-touch-icon.png| sizes=|180x180|>" +
			"    <link rel=|icon| href=|../../assets/Test02MatrizV1/img/favicon-32x32.png| sizes=|32x32| type=|image/png|>" +
			"    <link rel=|icon| href=|../../assets/Test02MatrizV1/img/favicon-16x16.png| sizes=|16x16| type=|image/png|>" +
			"    <link rel=|manifest| href=|../../assets/Test02MatrizV1/img/manifest.json|>" +
			"    <link rel=|mask-icon| href=|../../assets/Test02MatrizV1/img/safari-pinned-tab.svg| color=|#000000|>" +
			"   <link rel=|icon| href=|../../assets/Test02MatrizV1/img/favicon.ico|>" +
			"    <meta name=|theme-color| content=|#000000|>" +
			"    <link rel=|preconnect| href=|https://fonts.googleapis.com|>" +
			"    <link rel=|preconnect| href=|https://fonts.gstatic.com| crossorigin>" +
			"    <link href=|https://fonts.googleapis.com/css2?family=Oswald:wght@200;300&display=swap| rel=|stylesheet|>" +
			"	 <link rel=|stylesheet| href=|../../assets/Test02MatrizV1/css/sweetalert.css|>" + 
			"	 <script src=|../../assets/Test02MatrizV1/js/sweetalert.js|></script>" + 
			"  </head>" +
			"  <body>" +				
			"	<main id=|mainDiv|>" + 				
			"	</main>" +
			"    <script src=|../../assets/Test02MatrizV1/js/jquery-3.6.0.min.js|></script>" +
			"	 <script src=|../../assets/Test02MatrizV1/js/bootstrap.bundle.min.js| integrity=|sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM| crossorigin=|anonymous|></script>" +
			"    <script src=|../../assets/Test02MatrizV1/js/feather.min.js| integrity=|sha384-uO3SXW5IuS1ZpFPKugNNWqTZRRglnUJK6UAZ/gxOX80nxEkN9NcGZTftn6RzhGWE| crossorigin=|anonymous|></script>" +
			"    <script src=|../../assets/Test02MatrizV1/js/Chart.min.js| integrity=|sha384-zNy6FEbO50N+Cg5wap8IKA4M/ZnLJgzc6w2NqACZaK0u0FXfOWRRJOnQtpZun8ha| crossorigin=|anonymous|></script>" +				
			"    <script src=|../../assets/Test02MatrizV1/js/Test02MatrizV1.js| charset=|utf-8|></script>";				

			html += "" +				
			"</body>" +
			"</html>" +
			"";*/
			html = "" +
			"<!DOCTYPE html>" +
			"<html>" +
			"<head>" +
			"	<title></title>" +
			"	<script type=|text/javascript| src=|../../assets/Test02MatrizV1/js/phaser.min.js|></script>" +
			"	<script type=|text/javascript| src=|../../assets/Test02MatrizV1/js/sceneMain.js|></script>" +
			"	<script type=|text/javascript| src=|../../assets/Test02MatrizV1/js/main.js|></script>" +
			"	<script type=|text/javascript| src=|../../assets/Test02MatrizV1/js/AlignGrid.js|></script>" +
			"</head>" +
			"<body style=|margin: 0px|>" +
			"    <div id=|phaser-game|></div>" +
			"</body>" +
			"</html>";

			html = html.replace('|','"');
			out.println(html);
			
		}catch(IOException e) {
	  		e.printStackTrace();
		}		
	}
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException{		
		try {
			PrintWriter out = response.getWriter();	
			HttpSession session=request.getSession();
			String languaje = "en";

			String val1 = request.getRequestURI().toString();
			String[] val2 = val1.split("/");
			languaje = val2[1];
			session.setAttribute("languaje", languaje);
			out.println("Post method allowded");

		}catch(IOException e) {
	  		e.printStackTrace();
		}		
	}		
}