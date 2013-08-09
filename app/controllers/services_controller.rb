require 'flickraw'

FlickRaw.api_key="302a4a49d1f85726239821d77caa7f50"
FlickRaw.shared_secret="42087084f2b3168f"

class ServicesController < ApplicationController

  def flickr_user_photos


    sets = flickr.photosets.getList(:user_id => params[:user_id])

    p sets

    ids = []
    sets.each { |set| ids << set.id}
    
    photos = []

    ids.each do |id|
      ps_req = flickr.photosets.getPhotos(:photoset_id => id, :extras => 'url_m')
      photos.concat(ps_req.photo)
    end

    p photos.length

    render :json => photos

  end
end