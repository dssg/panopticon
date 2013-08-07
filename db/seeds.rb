# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name:'Chicago' }, { title:'Copenhagen' }])
#   Mayor.create(title:'Emanuel', city: cities.first)


Board.create(title:"DSSG", content: "First Try", 
  widgets: [
    Widget.new(title:"First Text", location: [0,0], size: [200, 200], widgettype: "text", 
      params: {content:"first sample text"}),
    Widget.new(title:"Second Text", location: [0,0], size: [200, 200], widgettype: "text"),
#    Widget.new(location: [200,200], size: [200, 200], widgettype: "twitter", :params => {username:"datascifellows", limit: 5})
    Widget.new(title:"DSSG Flickr", location: [200,200], size: [200, 200], widgettype: "flickr", 
      :params => {}),
    Widget.new(title:"Until End of Program", location: [200,200], size: [200, 200], widgettype: "countdown", 
      :params => {date: 1377248400})
  ])