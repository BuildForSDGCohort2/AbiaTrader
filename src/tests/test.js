// Import the dependencies for testing
import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../app';
// Configure chai
chai.use(chatHttp);
chai.should();
describe("Abia Project Application Unit Tests", () => {
    beforeEach( function (){
        const userid = 1;
        return userid;
    });
    describe("Test for GET tasks", () => {
        // Test to get all articles and gifs
        it("should get products", (done) => {
             chai.request(app)
                 .get('/api/v1/products/all')
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done(err);
                  });
         });

        it("should get a specific product", (done) => {
             const id = 3;
             chai.request(app)
                 .get(`/api/v1/product/${id}`)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done(err);
                  });
         });

        it("should get a specific user", (done) => {
             const id = 6;
             chai.request(app)
                 .get(`/api/v1/user/${id}`)
                 .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done(err);
                  });
         });
    });

    describe('Test for POST tasks', function() {
        it('Create a new user', function(done) {
            this.timeout(0);
                const user = {
                    email: 'jelel@yahoo.com', 
                    first_name: 'Hammed Taofeek', 
                    last_name: 'Hammed', 
                    phone: '08034565678', 
                    password: 'olajide', 
                };
                chai.request(app)
                .post('/api/v1/signup')
                .set('Accept', 'application/json')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done(err);
                });
        });

        it('Login a user', function(done) {
            this.timeout(0);
             chai.request(app)
                .post('/api/v1/signin')
                .send({
                    email: 'jelel@yahoo.com',
                    password: 'olajide'
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done(err);
                });
        });

        it('Post new product', function(done) {
            chai.request(app)
                .post('/api/v1/product/add')
                .send({
                    name: 'Shoe',
                    user_id: 1,
                    imageurl: 'product/shoe.png',
                    price: 1500.00
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done(err);
                });
        });

    });

    describe('Test for DELETE tasks', function() {

        it('Delete a product', function(done) {
            const productId = 1;
            chai.request(app)
                .delete(`/api/v1/product/${productId}`)
                .end(function(err, res) {
                    res.should.have.status(200);
                    //res.body.should.be.a('object');
                    done(err);
                });
        });
    });

    describe('Test for PATCH/PUT tasks', function() {
        it('Edit a product', function(done) {
            const productId = 1;
            chai.request(app)
                .put(`/api/v1/product/${productId}/edit`)
                .send({
                    name: 'Sandal',
                    user_id: 1,
                    imageurl: 'product/sandal.png',
                    price: 2500.00
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done(err);
                });
        });

        it('Edit a user phone description and address', function(done) {
            const userId = 1;
            chai.request(app)
                .put(`/api/v1/trader/update/${userId}`)
                .send({
                    bus_desc: 'I now make shoes and canvas', 
                    phone: '08034232134',
                    address: 'No 5 Sabo yaba lagos'
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done(err);
                });
        });

        // it('Edit a User profile photo', function(done) {
        //     const userid = 14;
        //     chai.request(app)
        //         .put(`/user/profile-photo/change/${userid}`)
        //         .send({
        //             photo: 'gifs/mypassport.jpg', 
        //         })
        //         .end(function(err, res) {
        //             res.should.have.status(200);
        //             res.body.should.be.a('object');
        //             done(err);
        //         });
        // });

    });
});