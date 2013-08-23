App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true
});

App.currentSession = null;

App.Router.map(function() {

  this.resource('sessions', function() {
    this.route('new')
  })   
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    moar_array  = []
    
    apiKey = App.currentSession ? App.currentSession.get('apiKey') : null;
    if(apiKey) { moar_array.add(apiKey); }
    return ['red', 'yellow', 'blue'].concat(moar_array);
  }
});

App.SessionsNewRoute = Ember.Route.extend({
  csession: 'null',

  model: function() {
    csession = this.session.newSession()
    s  = csession.create(App.Session,{username: 'h', password: 'ya'});
    return s;
  /*
    session = App.Session.create();
    var _this = this;
    session.one('didCreate', function() {
        return _this.afterCreate();
    });
*/
  },

  events: {
    login: function() {
        // console.debug('name is', this.get('controller.model.username'));
        // csession = this.get('session').newSession()
        // csession.add(this.get('controller.model'))
        var _that = this;
        this.get('context.session').flush() .then(function(models) {
           alert('succ');
        }, function(models) {
          var errors = models[0].get('errors')
          console.debug('failure', models[0].get('hasErrors'));
          // alert('failures');
          errors = _that.get('context.errors')
          console.log('hasError', _that.get('context.hasErrors'))
          errors.forEach(function(key, fieldErrors) {
            console.debug(key, ":", fieldErrors);
          });
          
        //   csession.merge(models[0])
        });
    }
  },

  // afterCreate: function() {
  //     App.currentSession = this.get('model');
  //     this.transitionToRoute('index');
  // }
});


App.User = Ep.Model.extend({
  firstName: Ep.attr('string'),
  // profile: Ep.belongsTo(App.Profile)
});


App.Session = Ep.Model.extend({
  email: Ep.attr('string'),
  password: Ep.attr('string'),
  apiKey: Ep.attr('string'),
  arr: Em.A,

  hasError: function(){
    // return true;
    val =  this.get('hasErrors');
    console.log('hasError is', val, val.constructor);
    return val;
  }.property('errors', 'hasErrors') ,

  customErrors: function(){
    arr = Ember.Set.create();
    this.get('errors').forEach(function(k,v){
        return arr.add({key: k, fieldErrors: v});
    });
    return arr.toArray();
  }.property('errors')
  
  // user: Ep.belongsTo(App.User)
});

App.Profile = Ep.Model.extend({
  byline: Ep.attr('string'),
  user: Ep.belongsTo(App.User)
});


App.Adapter = Ep.RestAdapter.extend({
  namespace: 'api',
  url: 'http://localhost:3000'
});

