const request = require('supertest');
const app = require('../app');  // Import your posts app

let postBoundaryTest = `PostController boundary test`;

describe('Post Controller', () => {
  describe('boundary', () => {

    // Test for the root route ("/")
    it(`${postBoundaryTest} should return a welcome message in JSON format`, async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Welcome to the Post API!');
    });

    // Test for the /posts route
    it(`${postBoundaryTest} should return a list of posts in JSON format`, async () => {
      const response = await request(app).get('/posts');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
    });

    // Test for the /posts/:id route (Get post by ID)
    it(`${postBoundaryTest} should return a post by ID in JSON format`, async () => {
      const response = await request(app).get('/posts/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body.title).toBe('Hello World');
    });

    // Test for the /posts/:id route (Post not found)
    it(`${postBoundaryTest} should return 404 if post is not found`, async () => {
      const response = await request(app).get('/posts/999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Post not found');
    });

    // Test for the /posts/filter route (Filter posts by title)
    it(`${postBoundaryTest} should return filtered posts by title`, async () => {
      const response = await request(app).get('/posts/filter?title=Node.js');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].title).toContain('Node.js');
    });

    // Test for the /posts/filter route (Filter posts by content)
    it(`${postBoundaryTest} should return filtered posts by content`, async () => {
      const response = await request(app).get('/posts/filter?content=cleaner');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].content.toLowerCase()).toContain('cleaner');
    });

    // Test for the /posts POST route (Create new post)
    it(`${postBoundaryTest} should create a new post and return the created post`, async () => {
      const newPost = { title: "Test Post", content: "This is a test post." };
      const response = await request(app).post('/posts').send(newPost);
      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.content).toBe(newPost.content);
      expect(response.body).toHaveProperty('id');
    });

    // Test for the /posts PUT route (Update an existing post)
    it(`${postBoundaryTest} should update an existing post and return the updated post`, async () => {
      const updatedPost = { title: "Updated Title", content: "Updated content." };
      const response = await request(app).put('/posts/1').send(updatedPost);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatedPost.title);
      expect(response.body.content).toBe(updatedPost.content);
    });

    // Test for the /posts PUT route (Post not found for update)
    it(`${postBoundaryTest} should return 404 when updating a non-existent post`, async () => {
      const updatedPost = { title: "Non-existent Post", content: "Does not exist." };
      const response = await request(app).put('/posts/999').send(updatedPost);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Post not found');
    });

    // Test for the /posts DELETE route (Delete an existing post)
    it(`${postBoundaryTest} should delete a post and return success message`, async () => {
      const response = await request(app).delete('/posts/1');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Post deleted successfully');
    });

    // Test for the /posts DELETE route (Post not found for deletion)
    it(`${postBoundaryTest} should return 404 when deleting a non-existent post`, async () => {
      const response = await request(app).delete('/posts/999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Post not found');
    });

    // Test for an invalid route (404)
    it(`${postBoundaryTest} should return 404 for invalid routes`, async () => {
      const response = await request(app).get('/invalid-posts-route');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Not Found');
    });
  });
});
