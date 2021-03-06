# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name:'Chicago' }, { title:'Copenhagen' }])
#   Mayor.create(title:'Emanuel', city: cities.first)


Board.create(title:"DSSG", description: "", 
  widgets: [
    Widget.new(title:"Sample Text", location: [3, 3], size: [2, 2], widgettype: "text", 
      params: {content:"Made by Vidhur!"}),
    # Widget.new(title:"Second Text", location: [3, 1], size: [2, 2], widgettype: "text"),
    # Widget.new(titlelocation: [200,200], size: [200, 200], widgettype: "twitter", :params => {username:"datascifellows", limit: 5})
    Widget.new(title:"DSSG Flickr", location: [5, 1], size: [2, 2], widgettype: "flickr", 
      :params => {user_id: "97358734@N03", interval: 5000}),
    Widget.new(title:"Until End of Program", location: [1, 1], size: [2, 2], widgettype: "countdown", 
      :params => {date: 1377248400}),
    Widget.new(title: "Most Frequently Used Words From Tweets Containing Chicago", location: [6,6], size: [2,2], widgettype: "image-dynamic",
      params: {url: "https://dl.dropboxusercontent.com/u/59988827/cloud_large.png", interval: 5000})
  ])