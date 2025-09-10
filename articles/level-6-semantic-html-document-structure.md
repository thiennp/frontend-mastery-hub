# Semantic HTML & Document Structure

## Overview

Semantic HTML is the foundation of accessible, maintainable, and SEO-friendly web applications. This article explores how to create meaningful document structures that communicate effectively with both users and assistive technologies.

## Table of Contents

1. [What is Semantic HTML?](#what-is-semantic-html)
2. [Document Structure Fundamentals](#document-structure-fundamentals)
3. [Semantic Elements](#semantic-elements)
4. [Headings and Document Outline](#headings-and-document-outline)
5. [Landmark Elements](#landmark-elements)
6. [Content Structure Patterns](#content-structure-patterns)
7. [SEO Considerations](#seo-considerations)
8. [Accessibility Benefits](#accessibility-benefits)
9. [Best Practices](#best-practices)
10. [Common Patterns](#common-patterns)

## What is Semantic HTML?

Semantic HTML uses elements that clearly describe their meaning and purpose, making content more accessible to both users and machines. Unlike presentational elements, semantic elements convey information about the content's structure and meaning.

### Key Principles

1. **Meaning Over Appearance**: Choose elements based on content meaning, not visual appearance
2. **Hierarchy and Structure**: Create clear document hierarchy
3. **Accessibility First**: Ensure content is accessible to all users
4. **SEO Optimization**: Help search engines understand content structure

## Document Structure Fundamentals

### Basic HTML5 Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
    <meta name="description" content="Page description for SEO">
</head>
<body>
    <header>
        <!-- Site header content -->
    </header>
    
    <nav>
        <!-- Navigation content -->
    </nav>
    
    <main>
        <!-- Main content area -->
    </main>
    
    <aside>
        <!-- Sidebar content -->
    </aside>
    
    <footer>
        <!-- Site footer content -->
    </footer>
</body>
</html>
```

### Document Outline

The document outline is created by heading elements (h1-h6) and sectioning elements (article, section, aside, nav). This creates a hierarchical structure that screen readers use for navigation.

```html
<article>
    <header>
        <h1>Article Title</h1>
        <p class="article-meta">Published on <time datetime="2024-01-15">January 15, 2024</time></p>
    </header>
    
    <section>
        <h2>Introduction</h2>
        <p>Article introduction content...</p>
    </section>
    
    <section>
        <h2>Main Content</h2>
        <p>Main article content...</p>
        
        <section>
            <h3>Subsection</h3>
            <p>Subsection content...</p>
        </section>
    </section>
    
    <footer>
        <p>Article footer with author info...</p>
    </footer>
</article>
```

## Semantic Elements

### Content Sectioning Elements

#### `<main>`
Represents the main content of the document. There should be only one `<main>` element per page.

```html
<main>
    <h1>Page Title</h1>
    <p>Main content of the page...</p>
</main>
```

#### `<section>`
Represents a standalone section of content that forms a complete unit of meaning.

```html
<section>
    <h2>Features</h2>
    <p>This section describes the features of our product.</p>
</section>
```

#### `<article>`
Represents a self-contained piece of content that could be distributed independently.

```html
<article>
    <header>
        <h2>Blog Post Title</h2>
        <time datetime="2024-01-15">January 15, 2024</time>
    </header>
    <p>Blog post content...</p>
</article>
```

#### `<aside>`
Represents content that is tangentially related to the main content.

```html
<aside>
    <h3>Related Articles</h3>
    <ul>
        <li><a href="/article1">Related Article 1</a></li>
        <li><a href="/article2">Related Article 2</a></li>
    </ul>
</aside>
```

### Text Content Elements

#### `<header>`
Represents introductory content or navigational aids.

```html
<header>
    <h1>Site Title</h1>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </nav>
</header>
```

#### `<footer>`
Represents footer content for its nearest ancestor sectioning element.

```html
<footer>
    <p>&copy; 2024 Company Name. All rights reserved.</p>
    <nav>
        <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
        </ul>
    </nav>
</footer>
```

#### `<nav>`
Represents a section of a page that contains navigation links.

```html
<nav aria-label="Main navigation">
    <ul>
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

### Text-Level Semantics

#### `<strong>` and `<em>`
- `<strong>`: Indicates strong importance or urgency
- `<em>`: Indicates emphasis or stress

```html
<p>This is <strong>very important</strong> information that you should <em>definitely</em> read.</p>
```

#### `<mark>`
Represents text that is marked or highlighted for reference purposes.

```html
<p>Search results for "accessibility": <mark>accessibility</mark> is important for web development.</p>
```

#### `<time>`
Represents a specific point in time or a duration.

```html
<p>Published on <time datetime="2024-01-15T10:30:00Z">January 15, 2024 at 10:30 AM</time></p>
```

#### `<address>`
Represents contact information for the nearest article or body element.

```html
<address>
    <p>Contact us at <a href="mailto:info@example.com">info@example.com</a></p>
    <p>123 Main Street, City, State 12345</p>
</address>
```

## Headings and Document Outline

### Heading Hierarchy

Headings create the document outline and should be used in logical order (h1 → h2 → h3, etc.).

```html
<h1>Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>
    <h3>Another Subsection</h3>
  <h2>Another Section</h2>
    <h3>Subsection</h3>
      <h4>Sub-subsection</h4>
```

### Skipping Heading Levels

Avoid skipping heading levels as it can confuse screen reader users.

```html
<!-- Bad: Skipping from h1 to h3 -->
<h1>Page Title</h1>
<h3>Section Title</h3>

<!-- Good: Proper hierarchy -->
<h1>Page Title</h1>
<h2>Section Title</h2>
```

### Multiple H1 Elements

While HTML5 allows multiple h1 elements, it's generally better to use one h1 per page for better SEO and accessibility.

```html
<!-- Good: One h1 per page -->
<main>
    <h1>Article Title</h1>
    <section>
        <h2>Section Title</h2>
    </section>
</main>

<!-- Acceptable: Multiple h1s in different articles -->
<article>
    <h1>Article 1 Title</h1>
</article>
<article>
    <h1>Article 2 Title</h1>
</article>
```

## Landmark Elements

Landmark elements help screen reader users navigate the page by identifying major sections.

### Common Landmarks

```html
<body>
    <header role="banner">
        <!-- Site header -->
    </header>
    
    <nav role="navigation" aria-label="Main navigation">
        <!-- Main navigation -->
    </nav>
    
    <main role="main">
        <!-- Main content -->
    </main>
    
    <aside role="complementary">
        <!-- Sidebar content -->
    </aside>
    
    <footer role="contentinfo">
        <!-- Site footer -->
    </footer>
</body>
```

### Custom Landmarks

You can create custom landmarks using ARIA roles.

```html
<div role="search" aria-label="Site search">
    <form>
        <label for="search">Search</label>
        <input type="search" id="search" name="q">
        <button type="submit">Search</button>
    </form>
</div>

<div role="region" aria-labelledby="news-heading">
    <h2 id="news-heading">Latest News</h2>
    <!-- News content -->
</div>
```

## Content Structure Patterns

### Article Pattern

```html
<article>
    <header>
        <h1>Article Title</h1>
        <div class="article-meta">
            <p>By <span class="author">Author Name</span></p>
            <time datetime="2024-01-15">January 15, 2024</time>
            <span class="reading-time">5 min read</span>
        </div>
    </header>
    
    <div class="article-content">
        <section>
            <h2>Introduction</h2>
            <p>Article introduction...</p>
        </section>
        
        <section>
            <h2>Main Content</h2>
            <p>Main content...</p>
        </section>
        
        <section>
            <h2>Conclusion</h2>
            <p>Conclusion...</p>
        </section>
    </div>
    
    <footer>
        <div class="article-tags">
            <h3>Tags</h3>
            <ul>
                <li><a href="/tag/web-development">Web Development</a></li>
                <li><a href="/tag/accessibility">Accessibility</a></li>
            </ul>
        </div>
    </footer>
</article>
```

### Card Pattern

```html
<article class="card">
    <header>
        <h3>Card Title</h3>
        <time datetime="2024-01-15">January 15, 2024</time>
    </header>
    
    <div class="card-content">
        <p>Card content description...</p>
    </div>
    
    <footer>
        <a href="/read-more" aria-label="Read more about Card Title">Read More</a>
    </footer>
</article>
```

### List Pattern

```html
<section>
    <h2>Features</h2>
    <ul>
        <li>
            <h3>Feature 1</h3>
            <p>Description of feature 1...</p>
        </li>
        <li>
            <h3>Feature 2</h3>
            <p>Description of feature 2...</p>
        </li>
    </ul>
</section>
```

## SEO Considerations

### Meta Tags

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title - Site Name</title>
    <meta name="description" content="Brief description of the page content">
    <meta name="keywords" content="keyword1, keyword2, keyword3">
    <meta name="author" content="Author Name">
    
    <!-- Open Graph tags for social sharing -->
    <meta property="og:title" content="Page Title">
    <meta property="og:description" content="Page description">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://example.com/page">
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Page Title">
    <meta name="twitter:description" content="Page description">
</head>
```

### Structured Data

```html
<article itemscope itemtype="https://schema.org/Article">
    <h1 itemprop="headline">Article Title</h1>
    <div itemprop="author" itemscope itemtype="https://schema.org/Person">
        <span itemprop="name">Author Name</span>
    </div>
    <time itemprop="datePublished" datetime="2024-01-15">January 15, 2024</time>
    <div itemprop="articleBody">
        <p>Article content...</p>
    </div>
</article>
```

### URL Structure

```html
<!-- Good: Descriptive URLs -->
<nav>
    <ul>
        <li><a href="/products/web-development">Web Development</a></li>
        <li><a href="/products/mobile-apps">Mobile Apps</a></li>
        <li><a href="/about/team">Our Team</a></li>
    </ul>
</nav>
```

## Accessibility Benefits

### Screen Reader Navigation

Semantic HTML provides landmarks and headings that screen readers use for navigation.

```html
<!-- Screen readers can navigate by headings -->
<h1>Main Page Title</h1>
  <h2>Navigation</h2>
  <h2>Main Content</h2>
    <h3>Article 1</h3>
    <h3>Article 2</h3>
  <h2>Sidebar</h2>
  <h2>Footer</h2>
```

### Keyboard Navigation

Proper semantic structure supports keyboard navigation patterns.

```html
<nav>
    <ul>
        <li><a href="/" tabindex="0">Home</a></li>
        <li><a href="/about" tabindex="0">About</a></li>
        <li><a href="/contact" tabindex="0">Contact</a></li>
    </ul>
</nav>
```

### Focus Management

Semantic elements help with focus management in complex interactions.

```html
<dialog>
    <h2>Confirmation Dialog</h2>
    <p>Are you sure you want to delete this item?</p>
    <div>
        <button type="button" onclick="closeDialog()">Cancel</button>
        <button type="button" onclick="confirmDelete()">Delete</button>
    </div>
</dialog>
```

## Best Practices

### 1. Use Semantic Elements Appropriately

```html
<!-- Good: Semantic meaning -->
<article>
    <h2>Blog Post Title</h2>
    <p>Blog post content...</p>
</article>

<!-- Bad: Generic div -->
<div class="blog-post">
    <div class="title">Blog Post Title</div>
    <div class="content">Blog post content...</div>
</div>
```

### 2. Maintain Logical Heading Hierarchy

```html
<!-- Good: Logical hierarchy -->
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>

<!-- Bad: Skipped levels -->
<h1>Page Title</h1>
  <h3>Section 1</h3>  <!-- Skipped h2 -->
```

### 3. Provide Meaningful Link Text

```html
<!-- Good: Descriptive link text -->
<a href="/products/web-development">Learn about our web development services</a>

<!-- Bad: Generic link text -->
<a href="/products/web-development">Click here</a>
```

### 4. Use Appropriate Form Elements

```html
<!-- Good: Proper form structure -->
<form>
    <fieldset>
        <legend>Contact Information</legend>
        <div>
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
    </fieldset>
    <button type="submit">Submit</button>
</form>
```

### 5. Include Alternative Text for Images

```html
<!-- Good: Descriptive alt text -->
<img src="chart.png" alt="Sales increased by 25% from Q1 to Q2 2024">

<!-- Bad: Generic alt text -->
<img src="chart.png" alt="Chart">
```

## Common Patterns

### Navigation Menu

```html
<nav aria-label="Main navigation">
    <ul>
        <li><a href="/" aria-current="page">Home</a></li>
        <li>
            <a href="/products" aria-expanded="false" aria-haspopup="true">Products</a>
            <ul>
                <li><a href="/products/web">Web Development</a></li>
                <li><a href="/products/mobile">Mobile Apps</a></li>
            </ul>
        </li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

### Data Table

```html
<table>
    <caption>Monthly Sales Report</caption>
    <thead>
        <tr>
            <th scope="col">Month</th>
            <th scope="col">Sales</th>
            <th scope="col">Growth</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">January</th>
            <td>$10,000</td>
            <td>+5%</td>
        </tr>
        <tr>
            <th scope="row">February</th>
            <td>$12,000</td>
            <td>+20%</td>
        </tr>
    </tbody>
</table>
```

### Form with Validation

```html
<form novalidate>
    <fieldset>
        <legend>User Registration</legend>
        
        <div>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required 
                   aria-describedby="username-error">
            <div id="username-error" role="alert" aria-live="polite"></div>
        </div>
        
        <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required
                   aria-describedby="email-error">
            <div id="email-error" role="alert" aria-live="polite"></div>
        </div>
        
        <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required
                   aria-describedby="password-help password-error">
            <div id="password-help">Password must be at least 8 characters long</div>
            <div id="password-error" role="alert" aria-live="polite"></div>
        </div>
    </fieldset>
    
    <button type="submit">Register</button>
</form>
```

## Conclusion

Semantic HTML is the foundation of accessible, maintainable, and SEO-friendly web applications. By using appropriate semantic elements, maintaining logical document structure, and following best practices, you create content that is accessible to all users and easily understood by both humans and machines.

Key takeaways:
- Use semantic elements based on content meaning, not appearance
- Maintain logical heading hierarchy and document outline
- Provide meaningful landmarks for navigation
- Include proper meta tags and structured data for SEO
- Test with screen readers and keyboard navigation
- Follow accessibility guidelines and best practices

## Next Steps

In the next article, we'll explore ARIA fundamentals and how to enhance semantic HTML with accessibility attributes for complex interactions and widgets.


